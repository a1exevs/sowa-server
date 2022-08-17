export interface IAuthenticationPayload {
    user: {
        id
    }
    payload: {
        type: string
        access_token: string
        refresh_token: string,
        refresh_token_expiration: Date
    }
}