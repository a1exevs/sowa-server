import {ApiProperty} from "@nestjs/swagger";
import {IAuthenticationPayload} from "../interfaces/IAuthenticationPayload";

export class AuthenticationResDto {
  constructor(userId: number, accessToken: string) {
    this.userId = userId;
    this.accessToken = accessToken;
  }

  @ApiProperty({example: 1, description: "Идентификатор авторизовавшегося пользователя"})
  private readonly userId: number;

  @ApiProperty({example: '111dsfsfsdfsdf', description: "Access Token"})
  private readonly accessToken: string;
}