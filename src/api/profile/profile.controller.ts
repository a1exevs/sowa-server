import {Controller, Get, UseGuards, Put, Param} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {RefreshTokenGuard} from "../auth/guards/refreshToken.guard";
import {ProfileService} from "./profile.service";
import {Profile} from "./profile.model";

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @ApiOperation({summary: "Получение профиля пользователя"})
    @ApiResponse({status: 200, type: Profile})
    @UseGuards(JwtAuthGuard, RefreshTokenGuard)
    @Get('/:userId')
    getProfile(@Param('userId') userId: string) {
        return this.profileService.getUserProfile(userId);
    }

    //@ApiOperation({summary: "Выдача роли пользователю"})
    //@ApiResponse({status: 201, type: User})
    //@Roles('admin')
    //@UseGuards(RolesGuard, RefreshTokenGuard)
    @Put()
    setProfile() {
        return "set Profile";
    }
}
