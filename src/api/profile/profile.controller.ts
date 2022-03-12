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
    UploadedFile
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {RefreshTokenGuard} from "../auth/guards/refreshToken.guard";
import {ProfileService} from "./profile.service";
import {Profile} from "./profile.model";
import { GetProfileResDTO } from "./ResDTO/GetProfileResDTO";
import { SetProfileReqDTO } from "./ReqDTO/SetProfileReqDto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CommonResDTO } from "../common/ResDTO/CommonResDTO";

@ApiTags("Профили")
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @ApiOperation({summary: "Получение профиля пользователя"})
    @ApiResponse({status: 200, type: GetProfileResDTO})
    @UseGuards(JwtAuthGuard, RefreshTokenGuard)
    @Get('/:userId')
    getProfile(@Param('userId', ParseIntPipe) userId: string) {
        return this.profileService.getUserProfile(Number(userId));
    }

    @ApiOperation({summary: "Изменение данных профиля пользователя"})
    @ApiResponse({status: 200, type: GetProfileResDTO})
    @UseGuards(JwtAuthGuard, RefreshTokenGuard)
    @Put()
    setProfile(@Body() dto: SetProfileReqDTO, @Req() request) {
        const userId = request.user.id
        return this.profileService.setUserProfile(userId, dto);
    }

    @ApiOperation({summary: "Изменение фотографии профиля пользователя"})
    @ApiResponse({status: 200, type: CommonResDTO})
    @UseGuards(JwtAuthGuard, RefreshTokenGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Put("/photo")
    setProfilePhoto(@UploadedFile() image, @Req() request) {
        const userId = request.user.id
        return this.profileService.setUserProfilePhoto(image, userId);
    }
}
