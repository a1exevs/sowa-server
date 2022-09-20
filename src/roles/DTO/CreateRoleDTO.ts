import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class CreateRoleDTO {
  constructor(value, description) {
    this.value = value;
    this.description = description;
  }

  @ApiProperty({example: "admin", description: "Уникальная Роль"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  value: string;

  @ApiProperty({example: "Администратор", description: "Описание Роли"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  description: string;
}