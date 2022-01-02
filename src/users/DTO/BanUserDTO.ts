import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class BanUserDTO {
  @ApiProperty({example: "1", description: "Идентификатор пользователя"})
  @IsNumber({},{message: "Должно быть числом"})
  readonly userID: number;

  @ApiProperty({example: "Спам", description: "Причина бана"})
  @IsString({message: "Должно быть строкой"})
  readonly banReason: string;
}