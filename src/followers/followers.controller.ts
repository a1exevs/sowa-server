import { Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Routes } from "../common/constants/routes";
import { FollowersService } from "./followers.service";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenGuard } from "../auth/guards/refreshToken.guard";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { ParsePositiveIntPipe } from "../common/pipes/parse-positive-int.pipe";

@ApiTags("Подписчики")
@Controller(Routes.ENDPOINT_FOLLOWERS)
export class FollowersController {
  constructor(private followersService: FollowersService) {}

  @ApiOperation({summary: "Подписка на пользователя"})
  @ApiResponse({status: 201, type: Boolean})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post('/:userId')
  follow(@Param('userId', ParsePositiveIntPipe) userId: number, @Req() request) {
    const followerId = request.user.id;
    return this.followersService.follow({ followerId, userId });
  }

  @ApiOperation({ summary: "Отписка от пользователя" })
  @ApiResponse({status: 201, type: Boolean})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Delete('/:userId')
  unfollow(@Param('userId', ParsePositiveIntPipe) userId: number, @Req() request) {
    const followerId = request.user.id;
    return this.followersService.unfollow({ followerId, userId });
  }
}
