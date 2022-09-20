import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class BanUserDTO {
  constructor(userId, banReason) {
    this.userId = userId;
    this.banReason = banReason;
  }

  @ApiProperty({example: 1, description: "Идентификатор пользователя"})
  @IsNumber({},{message: ErrorMessages.ru.MUST_BE_A_NUMBER})
  readonly userId: number;

  @ApiProperty({example: "Спам", description: "Причина бана"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  readonly banReason: string;
}