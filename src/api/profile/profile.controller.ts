import { Controller, Get, UseGuards, Put, Param, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {RefreshTokenGuard} from "../auth/guards/refreshToken.guard";
import {ProfileService} from "./profile.service";
import {Profile} from "./profile.model";
import { GetProfileResDTO } from "./ResDTO/GetProfileResDTO";

@ApiTags("Профили")
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @ApiOperation({summary: "Получение профиля пользователя"})
    @ApiResponse({status: 200, type: GetProfileResDTO})
    @UseGuards(JwtAuthGuard, RefreshTokenGuard)
    @Get('/:userId')
    getProfile(@Param('userId', ParseIntPipe) userId: string) {
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
