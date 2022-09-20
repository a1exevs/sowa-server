import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";
import { ErrorMessages } from "../../common/constants/error-messages";

export class SetPhotosReqDTO {
    constructor(small, large) {
        this.small = small;
        this.large = large;
    }

    @ApiProperty({example: "small_avatar.jpg", description: "Ссылка на фото профиля пользователя. Мелкий формат"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly small: string = "";

    @ApiProperty({example: "large_avatar.jpg", description: "Ссылка на фото профиля пользователя. Крупный формат"})
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly large: string = "";
}