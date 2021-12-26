import {ApiProperty} from "@nestjs/swagger";

export class AuthDataResponseDTO {
  @ApiProperty({example: "123451235sdfdsf", description: "Token пользователя при регистрации"})
  token: string;
}