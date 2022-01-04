import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import {Post as post} from "./posts.model"
import { CreatePostDTO } from "./DTO/CreatePostDTO";
import { FileInterceptor} from "@nestjs/platform-express";

@ApiTags("Посты")
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({summary: "Создание поста"})
  @ApiResponse({status: 201, type: post})
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() dto: CreatePostDTO, @UploadedFile() image) {
    return this.postsService.createPost(dto, image);
  }
}
