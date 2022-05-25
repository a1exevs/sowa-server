import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SetContactReqDTO {
    @ApiProperty({example: "facebook.com/george", description: "Ссылка на страницу в Facebook"})
    @IsString({message: "Должно быть строкой"})
    readonly facebook: string = "";

    @ApiProperty({example: "super-site.com", description: "Ссылка на личный веб-сайт"})
    @IsString({message: "Должно быть строкой"})
    readonly website: string = "";

    @ApiProperty({example: "twitter.com/george", description: "Ссылка на страницу в Twitter"})
    @IsString({message: "Должно быть строкой"})
    readonly twitter: string = "";

    @ApiProperty({example: "instagram.com/george", description: "Ссылка на страницу в Instagram"})
    @IsString({message: "Должно быть строкой"})
    readonly instagram: string = "";

    @ApiProperty({example: "youtube.com/george", description: "Ссылка на страницу Youtube"})
    @IsString({message: "Должно быть строкой"})
    readonly youtube: string = "";

    @ApiProperty({example: "github.com/george", description: "Ссылка на страницу Github"})
    @IsString({message: "Должно быть строкой"})
    readonly github: string = "";

    @ApiProperty({example: "vk.com/george", description: "Ссылка на страницу в ВК"})
    @IsString({message: "Должно быть строкой"})
    readonly vk: string = "";

    @ApiProperty({example: "mainLink.com/george", description: "Главная ссылка"})
    @IsString({message: "Должно быть строкой"})
    readonly mainLink: string = "";
}