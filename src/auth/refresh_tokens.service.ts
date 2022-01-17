import { Injectable } from '@nestjs/common'
import { User } from '../users/users.model'
import { RefreshToken } from './refresh_tokens.model'

@Injectable()
export class RefreshTokensService {
  public async createRefreshToken (user: User, ttl: number): Promise<RefreshToken> {
    const token = new RefreshToken()

    token.user_id = user.id
    token.is_revoked = false

    const expiration = new Date()
    expiration.setTime(expiration.getTime() + ttl)

    token.expires = expiration

    return token.save()
  }

  public async findTokenById (id: number): Promise<RefreshToken | null> {
    return RefreshToken.findOne({ where: { id, } })
  }
}