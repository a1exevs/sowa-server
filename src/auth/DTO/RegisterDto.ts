import { IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ErrorMessages } from "../../common/constants/error-messages";

export class RegisterDto {
  private static readonly passMinLength = 8;
  private static readonly passMaxLength = 50;

  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты пользователя"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  @IsEmail({}, {message: ErrorMessages.ru.MUST_HAS_EMAIL_FORMAT})
  public readonly email: string;

  @ApiProperty({example: "1234", description: "Пароль пользователя от учетной записи"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  @Length(RegisterDto.passMinLength, RegisterDto.passMaxLength, {
    message: ErrorMessages.ru.STRING_LENGTH_MUST_NOT_BE_LESS_THAN_M_AND_GREATER_THAN_N
      .format(RegisterDto.passMinLength, RegisterDto.passMaxLength)}
  )
  public readonly password: string;
}