import {ApiProperty} from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Length } from "class-validator";

export class CreatePostDTO {

  @ApiProperty({example: "Пост о Post-запросах", description: "Заголовок Поста"})
  @IsString({message: "Должно быть строкой"})
  readonly title: string;

  @ApiProperty({example: "Здесь текст данного поста", description: "Контентная часть Поста"})
  @IsString({message: "Должно быть строкой"})
  readonly content: string;
}