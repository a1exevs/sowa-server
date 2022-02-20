import {ApiProperty} from "@nestjs/swagger";
import { User } from "../users.model";

export class GetUsersResDto {
  @ApiProperty({type: [User], description: "Массив пользователей"})
  items: User[] = null;

  @ApiProperty({type: Number, example: "1234", description: "Общее количество пользователей"})
  totalCount: number = 0;

  @ApiProperty({type: String, example: "1234", description: "Максимальный размер страницы - 100 пользователей"})
  error: string = null;
}