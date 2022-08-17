import { IsOptional, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  constructor(email, password, captcha = null) {
    this.email = email;
    this.password = password;
    if (captcha)
      this.captcha = captcha
  }

  @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты пользователя"})
  @IsString({message: "Должно быть строкой"})
  readonly email: string;

  @ApiProperty({example: "1234", description: "Пароль пользователя от учетной записи"})
  @IsString({message: "Должно быть строкой"})
  readonly password: string;

  @ApiProperty({example: "1234", description: "Текст капчи"})
  @IsString({message: "Должно быть строкой"})
  @IsOptional()
  readonly captcha?: string;
}