import { IsOptional, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ErrorMessages } from "../../common/constants/error-messages";

export class LoginDto {
  constructor(email, password, captcha = null) {
    this.email = email;
    this.password = password;
    if (captcha)
      this.captcha = captcha
  }

  @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты пользователя"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  readonly email: string;

  @ApiProperty({example: "1234", description: "Пароль пользователя от учетной записи"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  readonly password: string;

  @ApiProperty({example: "1234", description: "Текст капчи"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  @IsOptional()
  readonly captcha?: string;
}