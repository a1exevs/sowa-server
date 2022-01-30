import {User} from "../../users/users.model";

export interface IAuthenticationPayload {
    user: User
    payload: {
        type: string
        access_token: string
        refresh_token: string,
        refresh_token_expiration: Date
    }
}