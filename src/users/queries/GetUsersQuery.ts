import { IsInt } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetUsersQuery{
  @ApiProperty({example: "1", description: "Номер страницы", default: 1, required: false })
  @Type(() => Number)
  @IsInt()
  readonly page: number = 1;

  @ApiProperty({example: "10", description: "Количество пациентов внутри ответа", default: 10, required: false})
  @Type(() => Number)
  @IsInt()
  readonly count: number = 10;
}
