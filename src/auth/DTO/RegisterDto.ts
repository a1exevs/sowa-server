import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты пользователя"})
  @IsString({message: "Должно быть строкой"})
  @IsEmail({}, {message: "Некорректный email"})
  public readonly email: string;

  @ApiProperty({example: "1234", description: "Пароль пользователя от учетной записи"})
  @IsString({message: "Должно быть строкой"})
  @Length(8, 50, {message: "Длина должна быть больше 8 и меньше 50 символов"})
  public readonly password: string;
}