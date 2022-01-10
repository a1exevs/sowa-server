import { Body, Controller, Inject, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import {Post as post} from "./posts.model"
import { CreatePostDTO } from "./DTO/CreatePostDTO";
import { FileInterceptor} from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { REQUEST } from "@nestjs/core";

@ApiTags("Посты")
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService,
              @Inject(REQUEST) private request) {}

  @ApiOperation({summary: "Создание поста"})
  @ApiResponse({status: 201, type: post})
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDTO, @UploadedFile() image) {
    const userID = this.request.user.id;
    return this.postsService.createPost(dto, image, userID);
  }
}
