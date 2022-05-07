import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "../users/ReqDTO/CreateUserDTO";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/users.model";
import { TokensService } from "./tokens.service";
import { RegisterDto } from "./DTO/RegisterDto";
import { LoginDto } from "./DTO/LoginDto";
import { AuthenticationResponse } from "./DTO/AuthenticationResponse";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService,
              private tokensService: TokensService) {}

  async login(dto: LoginDto) : Promise<AuthenticationResponse> {
    const user = await this.validateUser(dto);

    const token = await this.tokensService.generateAccessToken(user)
    const refresh = await this.tokensService.generateRefreshToken(user, TokensService.getRefreshTokenExpiresIn())

    return AuthService.buildResponsePayload(user, token, refresh, this.tokensService.getRefreshTokenExpiration());
  }

  async registration(dto: RegisterDto) : Promise<AuthenticationResponse> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if(candidate)
      throw new HttpException("Пользователь уже существуют", HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});

    const token = await this.tokensService.generateAccessToken(user)
    const refresh = await this.tokensService.generateRefreshToken(user, TokensService.getRefreshTokenExpiresIn())

    return AuthService.buildResponsePayload(user, token, refresh, this.tokensService.getRefreshTokenExpiration())
  }

  public async refresh(currentRefreshToken: string) : Promise<AuthenticationResponse>
  {
    const { user, access_token, refresh_token } = await this.tokensService.updateAccessRefreshTokensFromRefreshToken(currentRefreshToken)
    return AuthService.buildResponsePayload(user, access_token, refresh_token, this.tokensService.getRefreshTokenExpiration())
  }

  public async me(userId: number)
  {
    const user = await this.userService.getUserById(userId)

    return {
      status: 'success',
      data: user,
    }
  }

  public async logout(refreshToken: string) : Promise<boolean>
  {
    return await this.tokensService.removeRefreshToken(refreshToken);
  }

  private async validateUser(dto: CreateUserDTO)
  {
    const user = await this.userService.getUserByEmail(dto.email, true);
    if(user) {
      const passwordsEqual = await bcrypt.compare(dto.password, user.password);
      if (passwordsEqual)
        return user;
    }
    throw new UnauthorizedException({message: 'Неверный email или пароль'});
  }

  private static buildResponsePayload (user: User, accessToken: string, refreshToken: string, expiration: Date): AuthenticationResponse {
    const resp = new AuthenticationResponse;
    resp.status = "success";
    resp.data = {
      user: user,
      payload: {
        type: 'bearer',
        access_token: accessToken,
        refresh_token: refreshToken,
        refresh_token_expiration: expiration
      }
    }
    return resp;
  }
}
