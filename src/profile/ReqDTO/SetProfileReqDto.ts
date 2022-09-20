import {ApiProperty} from "@nestjs/swagger";
import {
    IsBoolean,
    IsObject, IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import {SetContactReqDTO} from "./SetContactReqDTO";
import { Type } from "class-transformer";
import { ErrorMessages } from "../../common/constants/error-messages";

export class SetProfileReqDTO {
    constructor(fullName, aboutMe, lookingForAJob, lookingForAJobDescription, contacts = null) {
        this.fullName = fullName;
        this.aboutMe = aboutMe;
        this.lookingForAJob = lookingForAJob;
        this.lookingForAJobDescription = lookingForAJobDescription;
        this.contacts = contacts;
    }

    @ApiProperty({example: "Гарри Поттер", description: "Полное имя пользователя"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly fullName: string;

    @ApiProperty({example: "Frontend-developer", description: "Данные пользователя"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly aboutMe: string;

    @ApiProperty({example: true, description: "Ищет ли Пользователь работу"})
    @IsBoolean({message: ErrorMessages.ru.MUST_BE_A_BOOLEAN})
    readonly lookingForAJob: boolean;

    @ApiProperty({example: "Ищу работу удаленно", description: "Описания искомой вакансии"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly lookingForAJobDescription: string;

    @ApiProperty({description: "Контакты"})
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => SetContactReqDTO)
    readonly contacts?: SetContactReqDTO;
}