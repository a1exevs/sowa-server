import {ApiProperty} from "@nestjs/swagger";
import { Column, DataType } from "sequelize-typescript";

export class CreateRoleDto {
  @ApiProperty({example: "admin", description: "Уникальная Роль"})
  value: string;

  @ApiProperty({example: "Администратор", description: "Описание Роли"})
  description: string;
}