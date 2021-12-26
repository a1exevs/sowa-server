import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDTO {
  @ApiProperty({example: "admin", description: "Уникальная Роль"})
  value: string;

  @ApiProperty({example: "Администратор", description: "Описание Роли"})
  description: string;
}