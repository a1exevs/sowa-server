import { Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Routes } from "../common/constants/routes";
import { FollowersService } from "./followers.service";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenGuard } from "../auth/guards/refreshToken.guard";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { ParsePositiveIntPipe } from "../common/pipes/parse-positive-int.pipe";
import { OperationResultResponseDto } from "../common/ResDTO/operation-result-response-dto";

@ApiTags("Подписчики")
@Controller(Routes.ENDPOINT_FOLLOWERS)
export class FollowersController {
  constructor(private followersService: FollowersService) {}

  @ApiOperation({summary: "Подписка на пользователя"})
  @ApiResponse({status: 201, type: OperationResultResponseDto})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post('/:userId')
  async follow(@Param('userId', ParsePositiveIntPipe) userId: number, @Req() request) {
    const followerId = request.user.id;
    const result = await this.followersService.follow({ followerId, userId });
    return new OperationResultResponseDto(result);
  }

  @ApiOperation({ summary: "Отписка от пользователя" })
  @ApiResponse({status: 201, type: OperationResultResponseDto})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Delete('/:userId')
  async unfollow(@Param('userId', ParsePositiveIntPipe) userId: number, @Req() request) {
    const followerId = request.user.id;
    const result = await this.followersService.unfollow({ followerId, userId });
    return new OperationResultResponseDto(result);
  }
}
