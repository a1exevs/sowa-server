import {ApiProperty} from "@nestjs/swagger";

export class RegisterResponseDto {
  @ApiProperty({example: "123451235sdfdsf", description: "Token пользователя при регистрации"})
  token: string;
}