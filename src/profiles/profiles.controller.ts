import {
  Controller,
  Get,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
  Req,
  Body,
  UseInterceptors,
  UploadedFile, UseFilters
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { JwtAuthGuard, RefreshTokenGuard } from "@common/guards";
import { ProfilesService } from "@profiles/profiles.service";
import { GetProfileResponse, SetProfileRequest } from "@profiles/dto";
import { CommonResponse } from "@common/dto";
import { HttpExceptionFilter } from "@common/exception-filters";
import { ResponseInterceptor } from "@common/interceptors";
import { Routes } from "@common/constants";

@ApiTags("Профили")
@Controller(Routes.ENDPOINT_PROFILES)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {
  }

  @ApiOperation({ summary: "Получение профиля пользователя" })
  @ApiResponse({ status: 200, type: GetProfileResponse.Swagger.GetProfileResponseDto })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get("/:userId")
  getProfile(@Param("userId", ParseIntPipe) userId: number) {
    return this.profilesService.getUserProfile(userId);
  }

  @ApiOperation({ summary: "Изменение данных профиля пользователя" })
  @ApiResponse({ status: 200, type: GetProfileResponse.Swagger.GetProfileResponseDto })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Put()
  setProfile(@Body() dto: SetProfileRequest.Dto, @Req() request) {
    const userId = request.user.id;
    return this.profilesService.setUserProfile(userId, dto);
  }

  @ApiOperation({ summary: "Изменение фотографии профиля пользователя" })
  @ApiResponse({ status: 200, type: CommonResponse.Swagger.CommonResponseDto })
  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @UseInterceptors(FileInterceptor("image"), ResponseInterceptor)
  @Put("/photo")
  setProfilePhoto(@UploadedFile() image, @Req() request) {
    const userId = request.user.id;
    return this.profilesService.setUserProfilePhoto(image, userId);
  }
}
