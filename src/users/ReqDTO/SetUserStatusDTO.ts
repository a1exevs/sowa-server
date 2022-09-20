import {ApiProperty} from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class SetUserStatusDTO {
  private static readonly maxStatusTextLength = 30

  constructor(status) {
    this.status = status;
  }

  @ApiProperty({example: "Status", description: "Статус пользователя"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  @Length(0, SetUserStatusDTO.maxStatusTextLength, { message: ErrorMessages.ru.STRING_LENGTH_MUST_NOT_BE_GREATER_THAN_N.format(SetUserStatusDTO.maxStatusTextLength) })
  readonly status: string;
}