import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoleDTO {
  @IsString({message: "Должно быть строкой"})
  @ApiProperty({example: "admin", description: "Уникальная Роль"})
  value: string;

  @IsString({message: "Должно быть строкой"})
  @ApiProperty({example: "Администратор", description: "Описание Роли"})
  description: string;
}