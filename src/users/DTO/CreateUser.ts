import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({example: "user@yandex.ru", description: "Адрес электронной почты пользователя"})
  readonly email: string;

  @ApiProperty({example: "1234", description: "Пароль пользователя от учетной записи"})
  readonly password: string;
}