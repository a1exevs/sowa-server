import {ApiProperty} from "@nestjs/swagger";
import { User } from "../../users/users.model";

export class CommonResDTO {
  @ApiProperty({example: [User], description: "Данные по запросу"})
  data: any = null;

  @ApiProperty({example: ["Данные отправлены в реестр"], description: "Массив сообщений по результатам выполнения запроса"})
  messages: string[] = [];

  @ApiProperty({example: ["email - не должно быть пустым"], description: "Массив сообщений об ошибках в полях запроса"})
  fieldsErrors: string[] = [];

  @ApiProperty({example: 0, description: "Код результата выполнения запроса"})
  resultCode: number = 0;
}