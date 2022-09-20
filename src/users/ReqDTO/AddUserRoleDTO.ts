import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class AddUserRoleDTO {
  constructor(value, userId) {
    this.value = value;
    this.userId = userId;
  }

  @ApiProperty({example: "admin", description: "Значение выдаваемой роли"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  readonly value: string;

  @ApiProperty({example: 1, description: "Идентификатор пользователя"})
  @IsNumber({}, {message: ErrorMessages.ru.MUST_BE_A_NUMBER})
  readonly userId: number;
}