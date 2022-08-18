import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class BanUserDTO {
  constructor(userId, banReason) {
    this.userId = userId;
    this.banReason = banReason;
  }

  @ApiProperty({example: 1, description: "Идентификатор пользователя"})
  @IsNumber({},{message: "Должно быть числом"})
  readonly userId: number;

  @ApiProperty({example: "Спам", description: "Причина бана"})
  @IsString({message: "Должно быть строкой"})
  readonly banReason: string;
}