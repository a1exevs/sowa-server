import {ApiProperty} from "@nestjs/swagger";

export class GetPhotosResDTO {
    @ApiProperty({example: "small_avatar.jpg", description: "Ссылка на фото профиля пользователя. Мелкий формат"})
    small: string = "";

    @ApiProperty({example: "large_avatar.jpg", description: "Ссылка на фото профиля пользователя. Крупный формат"})
    large: string = "";
}