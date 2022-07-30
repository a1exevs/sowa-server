import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AddUserRoleDTO {
  @ApiProperty({example: "admin", description: "Значение выдаваемой роли"})
  @IsString({message: "Должно быть строкой"})
  readonly value: string;

  @ApiProperty({example: 1, description: "Идентификатор пользователя"})
  @IsNumber({}, {message: "Должно быть числом"})
  readonly userId: number;
}