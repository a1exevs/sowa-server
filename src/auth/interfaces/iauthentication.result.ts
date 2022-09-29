export interface IAuthenticationResult {
  readonly status: string,
  readonly data: {
    readonly user: {
      readonly id: number
    }
    readonly payload: {
      readonly type: string
      readonly access_token: string
      readonly refresh_token: string,
      readonly refresh_token_expiration: Date
    }
  }
}