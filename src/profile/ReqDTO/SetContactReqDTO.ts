import {ApiProperty} from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class SetContactReqDTO {
    constructor(facebook, website, twitter, instagram, youtube, github, vk, mainLink) {
        this.facebook = facebook;
        this.website = website;
        this.twitter = twitter;
        this.instagram = instagram;
        this.youtube = youtube;
        this.github = github;
        this.vk = vk;
        this.mainLink = mainLink;
    }

    @ApiProperty({example: "facebook.com/george", description: "Ссылка на страницу в Facebook"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly facebook: string = "";

    @ApiProperty({example: "super-site.com", description: "Ссылка на личный веб-сайт"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly website: string = "";

    @ApiProperty({example: "twitter.com/george", description: "Ссылка на страницу в Twitter"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly twitter: string = "";

    @ApiProperty({example: "instagram.com/george", description: "Ссылка на страницу в Instagram"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly instagram: string = "";

    @ApiProperty({example: "youtube.com/george", description: "Ссылка на страницу Youtube"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly youtube: string = "";

    @ApiProperty({example: "github.com/george", description: "Ссылка на страницу Github"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly github: string = "";

    @ApiProperty({example: "vk.com/george", description: "Ссылка на страницу в ВК"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly vk: string = "";

    @ApiProperty({example: "mainLink.com/george", description: "Главная ссылка"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly mainLink: string = "";
}