import { HttpStatus, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "../users/DTO/CreateUserDTO";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { User } from "../users/users.model";
import { AuthDataResponseDTO } from "./DTO/AuthDataResponseDTO";
import { TokensService } from "./tokens.service";
import { RegisterDto } from "./DTO/RegisterDto";
import { LoginDto } from "./DTO/LoginDto";
import { RefreshDto } from "./DTO/RefreshDto";

export interface AuthenticationPayload {
  user: User
  payload: {
    type: string
    token: string
    refresh_token?: string
  }
}

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService,
              private tokensService: TokensService) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const token = await this.tokensService.generateAccessToken(user)
    const refresh = await this.tokensService.generateRefreshToken(user, 60 * 60 * 24 * 30)

    const payload = this.buildResponsePayload(user, token, refresh)

    return {
      status: 'success',
      data: payload,
    }
  }

  async registration(dto: RegisterDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if(candidate)
      throw new HttpException("Пользователь уже существуют", HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});

    const token = await this.tokensService.generateAccessToken(user)
    const refresh = await this.tokensService.generateRefreshToken(user, 60 * 60 * 24 * 30)

    const payload = this.buildResponsePayload(user, token, refresh)

    return {
      status: 'success',
      data: payload,
    }
  }

  public async refresh(dto: RefreshDto)
  {
    const { user, token } = await this.tokensService.createAccessTokenFromRefreshToken(dto.refresh_token)

    const payload = this.buildResponsePayload(user, token)

    return {
      status: 'success',
      data: payload,
    }
  }

  public async me(userId: number)
  {
    const user = await this.userService.getUserBuId(userId)

    return {
      status: 'success',
      data: user,
    }
  }

  private async generateToken(user: User)
  {
    const payload = {email: user.email, id: user.id, roles: user.roles};
    const response = new AuthDataResponseDTO;
    response.token = this.jwtService.sign(payload);
    return response;
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

  private buildResponsePayload (user: User, accessToken: string, refreshToken?: string): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      }
    }
  }
}
