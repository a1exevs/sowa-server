import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты пользователя"})
  @IsString({message: "Должно быть строкой"})
  @IsEmail({}, {message: "Некорректный email"})
  readonly email: string;

  @ApiProperty({example: "1234", description: "Пароль пользователя от учетной записи"})
  @IsString({message: "Должно быть строкой"})
  @Length(4, 16, {message: "Длина должна быть больше 4 и меньше 16 символов"})
  readonly password: string;
}