import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserRequest } from '@users/dto';
import { UsersService } from '@users/users.service';
import { User } from '@users/users.model';
import { TokensService } from '@auth/tokens.service';
import { RegisterRequest, LoginRequest, GetCurrentUserResponse } from '@auth/dto';
import { IAuthenticationResult } from '@auth/interfaces';
import { ErrorMessages } from '@common/constants/error-messages';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}

  public async registration(dto: RegisterRequest.Dto): Promise<IAuthenticationResult> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) throw new HttpException(ErrorMessages.ru.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({ ...dto, password: hashPassword });

    const token = await this.tokensService.generateAccessToken(user);
    const refresh = await this.tokensService.generateRefreshToken(user, TokensService.getRefreshTokenExpiresIn());

    return AuthService.buildResponsePayload(user, token, refresh, this.tokensService.getRefreshTokenExpiration());
  }

  async login(dto: LoginRequest.Dto): Promise<IAuthenticationResult> {
    const user = await this.validateUser(dto);

    const token = await this.tokensService.generateAccessToken(user);
    const refresh = await this.tokensService.generateRefreshToken(user, TokensService.getRefreshTokenExpiresIn());

    return AuthService.buildResponsePayload(user, token, refresh, this.tokensService.getRefreshTokenExpiration());
  }

  public async refresh(currentRefreshToken: string): Promise<IAuthenticationResult> {
    const { user, access_token, refresh_token } = await this.tokensService.updateAccessRefreshTokensFromRefreshToken(
      currentRefreshToken,
    );
    return AuthService.buildResponsePayload(
      user,
      access_token,
      refresh_token,
      this.tokensService.getRefreshTokenExpiration(),
    );
  }

  public async me(userId: number): Promise<GetCurrentUserResponse.Dto> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UnauthorizedException({ message: ErrorMessages.ru.UNAUTHORIZED });

    return new GetCurrentUserResponse.Dto({
      id: user.id,
      email: user.email,
    });
  }

  public async logout(refreshToken: string): Promise<boolean> {
    return await this.tokensService.removeRefreshToken(refreshToken);
  }

  private async validateUser(dto: CreateUserRequest.Dto) {
    const user = await this.userService.getUserByEmail(dto.email, true);
    if (user) {
      const passwordsEqual = await bcrypt.compare(dto.password, user.password);
      if (passwordsEqual) return user;
    }
    throw new UnauthorizedException({ message: ErrorMessages.ru.INVALID_EMAIL_OR_PASSWORD });
  }

  private static buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken: string,
    expiration: Date,
  ): IAuthenticationResult {
    return {
      status: 'success',
      data: {
        user: {
          id: user.id,
        },
        payload: {
          type: 'bearer',
          access_token: accessToken,
          refresh_token: refreshToken,
          refresh_token_expiration: expiration,
        },
      },
    };
  }
}
