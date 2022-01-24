import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {CreateUserDTO} from "../users/DTO/CreateUserDTO";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {User} from "../users/users.model";
import {TokensService} from "./tokens.service";
import {RegisterDto} from "./DTO/RegisterDto";
import {LoginDto} from "./DTO/LoginDto";
import {AuthenticationResponse} from "./DTO/AuthenticationResponse";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService,
              private tokensService: TokensService) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const token = await this.tokensService.generateAccessToken(user)
    const refresh = await this.tokensService.generateRefreshToken(user, 60 * 60 * 24 * 30)

    return this.buildResponsePayload(user, token, refresh);
  }

  async registration(dto: RegisterDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if(candidate)
      throw new HttpException("Пользователь уже существуют", HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});

    const token = await this.tokensService.generateAccessToken(user)
    const refresh = await this.tokensService.generateRefreshToken(user, 60 * 60 * 24 * 30)

    return this.buildResponsePayload(user, token, refresh)
  }

  public async refresh(refresh_token: string)
  {
    const { user, token } = await this.tokensService.createAccessTokenFromRefreshToken(refresh_token)
    return this.buildResponsePayload(user, token)
  }

  public async me(userId: number)
  {
    const user = await this.userService.getUserById(userId)

    return {
      status: 'success',
      data: user,
    }
  }

  public async logout(refresh_token: string)
  {
    return await this.tokensService.removeRefreshToken(refresh_token);
  }

  private async validateUser(dto: CreateUserDTO)
  {
    const user = await this.userService.getUserByEmail(dto.email);
    if(user) {
      const passwordsEqual = await bcrypt.compare(dto.password, user.password);
      if (passwordsEqual)
        return user;
    }
    throw new UnauthorizedException({message: 'Неверный email или пароль'});
  }

  private buildResponsePayload (user: User, accessToken: string, refreshToken?: string): AuthenticationResponse {
    const resp = new AuthenticationResponse;
    resp.status = "success";
    resp.data = {
      user: user,
      payload: {
        type: 'bearer',
        access_token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      }
    }
    return resp;
  }
}
