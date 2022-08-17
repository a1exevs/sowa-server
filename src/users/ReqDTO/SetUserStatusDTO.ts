import {ApiProperty} from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class SetUserStatusDTO {
  constructor(status) {
    this.status = status;
  }

  @ApiProperty({example: "Status", description: "Статус пользователя"})
  @IsString({message: "Должно быть строкой"})
  @Length(0, 30, {message: "Длина должна быть меньше 30 символов"})
  readonly status: string;
}