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

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.uuid),
    }

    return this.jwtService.signAsync({}, opts)
  }

  public async updateAccessRefreshTokensFromRefreshToken (refresh: string): Promise<{ refresh_token: string, access_token: string, user: User }> {
    const { user, newRefreshToken } = await this.updateRefreshToken(refresh)
    const access_token = await this.generateAccessToken(user)

    return { user, access_token, refresh_token: newRefreshToken }
  }

  public async removeRefreshToken(refreshToken: string): Promise<boolean> {
    const payload = await this.decodeRefreshToken(refreshToken);
    return !!await this.refreshTokensService.removeTokenByUUId(payload.jti);
  }

  public static getRefreshTokenExpiresIn() : number
  {
    return 60 * 60 * 24 * 30 * 1000;
  }

  public getRefreshTokenExpiration() : Date
  {
    const expiration = new Date()
    expiration.setTime(expiration.getTime() + TokensService.getRefreshTokenExpiresIn())
    return expiration;
  }

  private async updateRefreshToken (encoded: string): Promise<{ user: User, newRefreshToken: string }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

    await this.removeRefreshToken(encoded);

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

    const newRefreshToken = await this.generateRefreshToken(user, TokensService.getRefreshTokenExpiresIn())

    return { user, newRefreshToken }
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

    return this.refreshTokensService.findTokenByUUId(tokenId)
  }
}