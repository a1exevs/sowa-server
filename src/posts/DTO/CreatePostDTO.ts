import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDTO {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  @ApiProperty({example: "Пост о Post-запросах", description: "Заголовок Поста"})
  @IsString({message: "Должно быть строкой"})
  readonly title: string;

  @ApiProperty({example: "Здесь текст данного поста", description: "Контентная часть Поста"})
  @IsString({message: "Должно быть строкой"})
  readonly content: string;
}