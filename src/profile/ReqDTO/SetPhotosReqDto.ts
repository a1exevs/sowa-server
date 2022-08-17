import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class SetPhotosReqDTO {
    constructor(small, large) {
        this.small = small;
        this.large = large;
    }

    @ApiProperty({example: "small_avatar.jpg", description: "Ссылка на фото профиля пользователя. Мелкий формат"})
    @IsString({message: "Должно быть строкой"})
    readonly small: string = "";

    @ApiProperty({example: "large_avatar.jpg", description: "Ссылка на фото профиля пользователя. Крупный формат"})
    @IsString({message: "Должно быть строкой"})
    readonly large: string = "";
}