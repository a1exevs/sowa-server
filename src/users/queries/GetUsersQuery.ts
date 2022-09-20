import { IsInt, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ErrorMessages } from "../../common/constants/error-messages";

export class GetUsersQuery{
  private static readonly minPage = 1;
  private static readonly minUsersCount = 1;
  private static readonly maxUsersCount = 100;

  constructor(page, count) {
    this.page = page;
    this.count = count;
  }

  @ApiProperty({example: "1", description: "Номер страницы", default: 1, required: false })
  @Type(() => Number)
  @IsInt({ message: ErrorMessages.ru.MUST_BE_AN_INTEGER_NUMBER })
  @Min(GetUsersQuery.minPage, { message: ErrorMessages.ru.NUMERIC_MUST_NOT_BE_LESS_THAN_N.format(GetUsersQuery.minPage) })
  readonly page: number = 1;

  @ApiProperty({example: "10", description: "Количество пациентов внутри ответа", default: 10, required: false})
  @Type(() => Number)
  @IsInt({ message: ErrorMessages.ru.MUST_BE_AN_INTEGER_NUMBER })
  @Min(GetUsersQuery.minUsersCount, { message: ErrorMessages.ru.NUMERIC_MUST_NOT_BE_LESS_THAN_N.format(GetUsersQuery.minUsersCount) })
  @Max(GetUsersQuery.maxUsersCount, { message: ErrorMessages.ru.NUMERIC_MUST_NOT_BE_GREATER_THAN_N.format(GetUsersQuery.maxUsersCount) })
  readonly count: number = 10;
}
