import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class CreatePostDTO {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  @ApiProperty({example: "Пост о Post-запросах", description: "Заголовок Поста"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  readonly title: string;

  @ApiProperty({example: "Здесь текст данного поста", description: "Контентная часть Поста"})
  @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
  readonly content: string;
}