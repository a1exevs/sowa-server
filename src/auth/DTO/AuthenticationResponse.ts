import {ApiProperty} from "@nestjs/swagger";
import {IAuthenticationPayload} from "../interfaces/IAuthenticationPayload";

export class AuthenticationResponse {
    @ApiProperty({example: "success", description: "Статус проведения аутентификации пользователя"})
    status: string;

    @ApiProperty({description: "Данные авторизовавшегося пользователя"})
    data: IAuthenticationPayload
}