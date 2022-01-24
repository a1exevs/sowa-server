import { UnprocessableEntityException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignOptions, TokenExpiredError } from 'jsonwebtoken'
import { User } from '../users/users.model'
import { RefreshToken } from './refresh_tokens.model'
import { UsersService } from '../users/users.service'
import { RefreshTokensService } from './refresh_tokens.service'

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://sowa-api.com',
  audience:'https://sowa-api.com',
}

export interface RefreshTokenPayload {
  jti: number;
  sub: number
}

@Injectable()
export class TokensService {
  private readonly refreshTokensService: RefreshTokensService
  private readonly usersService: UsersService
  private readonly jwtService: JwtService

  public constructor (refreshTokensService: RefreshTokensService, usersService: UsersService, jwtService: JwtService) {
    this.refreshTokensService = refreshTokensService
    this.usersService = usersService
    this.jwtService = jwtService
  }

  public async generateAccessToken (user: User): Promise<string> {
    const payload = {email: user.email, id: user.id, roles: user.roles};
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    }

    return await this.jwtService.signAsync(payload, opts);
  }

  public async generateRefreshToken (user: User, expiresIn: number): Promise<string> {
    const token = await this.refreshTokensService.createRefreshToken(user, expiresIn)

    //const payload = {email: user.email, id: user.id, roles: user.roles};
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.id),
    }

    return this.jwtService.signAsync({}, opts)
  }

  public async createAccessTokenFromRefreshToken (refresh: string): Promise<{ token: string, user: User }> {
    const { user } = await this.resolveRefreshToken(refresh)

    const token = await this.generateAccessToken(user)

    return { user, token }
  }

  public async removeRefreshToken(refresh_token: string): Promise<number> {
    const payload = await this.decodeRefreshToken(refresh_token);
    return await this.refreshTokensService.removeTokenById(payload.jti);
  }

  private async resolveRefreshToken (encoded: string): Promise<{ user: User, token: RefreshToken }> {

    /**
     * @todo Обновлять RefreshToken
     * 1)Сервер получает запись рефреш-сессии по UUID'у рефреш токена
       2) Сохраняет текущую рефреш-сессию в переменную и удаляет ее из таблицы
       3) Проверяет текущую рефреш-сессию:
        Не истекло ли время жизни
        На соответствие старого fingerprint'a полученного из текущей рефреш-сессии с новым полученным из тела запроса
       4) В случае негативного результата бросает ошибку TOKEN_EXPIRED/INVALID_REFRESH_SESSION
       5) В случае успеха создает новую рефреш-сессию и записывает ее в БД
     */

    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found')
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked')
    }

    const user = await this.getUserFromRefreshTokenPayload(payload)

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return { user, token }
  }

  private async decodeRefreshToken (token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired')
      } else {
        throw new UnprocessableEntityException('Refresh token malformed')
      }
    }
  }

  private async getUserFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<User> {
    const subId = payload.sub

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.usersService.getUserById(subId)
  }

  private async getStoredTokenFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<RefreshToken | null> {
    const tokenId = payload.jti

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.refreshTokensService.findTokenById(tokenId)
  }
}