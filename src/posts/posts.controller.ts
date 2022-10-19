import { Body, Controller, Inject, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { REQUEST } from '@nestjs/core';

import { PostsService } from '@posts/posts.service';
import { Post as post } from '@posts/posts.model';
import { CreatePostRequest } from '@posts/dto';
import { JwtAuthGuard, RefreshTokenGuard } from '@common/guards';
import { Routes } from '@common/constants';

@ApiTags('Посты')
@Controller(Routes.ENDPOINT_POSTS)
export class PostsController {
  constructor(private postsService: PostsService, @Inject(REQUEST) private request) {}

  @ApiOperation({ summary: 'Создание поста' })
  @ApiResponse({ status: 201, type: post })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post()
  create(@Body() dto: CreatePostRequest.Dto, @UploadedFile() image) {
    const userID = this.request.user.id;
    return this.postsService.createPost(dto, image, userID);
  }
}
