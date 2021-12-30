import { ApiProperty } from "@nestjs/swagger";

export class AddUserRoleDTO {
  @ApiProperty({example: "admin", description: "Значение выдаваемой роли"})
  readonly value: string;

  @ApiProperty({example: "1", description: "Идентификатор пользователя"})
  readonly userID: number;
}