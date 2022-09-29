import { Body, Controller, Inject, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import {Post as post} from "./posts.model"
import { CreatePostRequest } from "./dto/create-post.request";
import { FileInterceptor} from "@nestjs/platform-express";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { REQUEST } from "@nestjs/core";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { Routes } from "../common/constants/routes";

@ApiTags("Посты")
@Controller(Routes.ENDPOINT_POSTS)
export class PostsController {
  constructor(private postsService: PostsService,
              @Inject(REQUEST) private request) {}

  @ApiOperation({summary: "Создание поста"})
  @ApiResponse({status: 201, type: post})
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post()
  create(@Body() dto: CreatePostRequest.Dto, @UploadedFile() image) {
    const userID = this.request.user.id;
    return this.postsService.createPost(dto, image, userID);
  }
}
