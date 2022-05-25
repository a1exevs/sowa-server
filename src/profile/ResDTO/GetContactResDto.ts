import {ApiProperty} from "@nestjs/swagger";

export class GetContactResDto {
  @ApiProperty({example: "facebook.com/george", description: "Ссылка на страницу в Facebook"})
  facebook: string = "";

  @ApiProperty({example: "super-site.com", description: "Ссылка на личный веб-сайт"})
  website: string = "";

  @ApiProperty({example: "twitter.com/george", description: "Ссылка на страницу в Twitter"})
  twitter: string = "";

  @ApiProperty({example: "instagram.com/george", description: "Ссылка на страницу в Instagram"})
  instagram: string = "";

  @ApiProperty({example: "youtube.com/george", description: "Ссылка на страницу Youtube"})
  youtube: string = "";

  @ApiProperty({example: "github.com/george", description: "Ссылка на страницу Github"})
  github: string = "";

  @ApiProperty({example: "vk.com/george", description: "Ссылка на страницу в ВК"})
  vk: string = "";

  @ApiProperty({example: "mainLink.com/george", description: "Главная ссылка"})
  mainLink: string = "";
}