import {ApiProperty} from "@nestjs/swagger";
import {
    IsBoolean,
    IsDefined,
    IsIn,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested
} from "class-validator";
import {SetContactReqDTO} from "./SetContactReqDTO";
import { Type } from "class-transformer";

export class SetProfileReqDTO {
    @ApiProperty({example: "Гарри Поттер", description: "Полное имя пользователя"})
    @IsString({message: "Должно быть строкой"})
    readonly fullName: string;

    @ApiProperty({example: "Frontend-developer", description: "Данные пользователя"})
    @IsString({message: "Должно быть строкой"})
    readonly aboutMe: string;

    @ApiProperty({example: true, description: "Ищет ли Пользователь работу"})
    @IsBoolean({message: "Должно быть булевым значением"})
    readonly lookingForAJob: boolean;

    @ApiProperty({example: "Ищу работу удаленно", description: "Описания искомой вакансии"})
    @IsString({message: "Должно быть строкой"})
    readonly lookingForAJobDescription: string;

    @ApiProperty({description: "Контакты"})
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SetContactReqDTO)
    readonly contacts: SetContactReqDTO;
}