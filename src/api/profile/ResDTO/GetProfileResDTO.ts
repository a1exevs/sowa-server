import {ApiProperty} from "@nestjs/swagger";
import { GetContactResDto } from "./GetContactResDto";

export class GetProfileResDTO {
  @ApiProperty({example: "Гарри Поттер", description: "Полное имя пользователя"})
  fullName: string = "";

  @ApiProperty({example: "Frontend-developer", description: "Данные пользователя"})
  aboutMe: string = "";

  @ApiProperty({example: true, description: "Ищет ли Пользователь работу"})
  lookingForAJob: boolean = false;

  @ApiProperty({example: "Ищу работу удаленно", description: "Описания искомой вакансии"})
  lookingForAJobDescription: string = "";

  @ApiProperty({description: "Контакты"})
  contacts: GetContactResDto = null;
}