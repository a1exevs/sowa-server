import { ApiProperty } from "@nestjs/swagger";

export class BanUserDTO {
  @ApiProperty({example: "1", description: "Идентификатор пользователя"})
  readonly userID: number;

  @ApiProperty({example: "Спам", description: "Причина бана"})
  readonly banReason: string;
}