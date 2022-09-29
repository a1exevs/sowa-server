import { Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Routes } from "../common/constants/routes";
import { FollowersService } from "./followers.service";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ParsePositiveIntPipe } from "../common/pipes/parse-positive-int.pipe";
import { OperationResultResponse } from "../common/dto/operation-result.response";

@ApiTags("Подписчики")
@Controller(Routes.ENDPOINT_FOLLOWERS)
export class FollowersController {
  constructor(private followersService: FollowersService) {}

  @ApiOperation({summary: "Подписка на пользователя"})
  @ApiResponse({status: 201, type: OperationResultResponse.Swagger.OperationResultResponseDto})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Post('/:userId')
  async follow(@Param('userId', ParsePositiveIntPipe) userId: number, @Req() request) {
    const followerId = request.user.id;
    const result = await this.followersService.follow({ followerId, userId });
    return new OperationResultResponse.Dto({ result });
  }

  @ApiOperation({ summary: "Отписка от пользователя" })
  @ApiResponse({status: 201, type: OperationResultResponse.Swagger.OperationResultResponseDto})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Delete('/:userId')
  async unfollow(@Param('userId', ParsePositiveIntPipe) userId: number, @Req() request) {
    const followerId = request.user.id;
    const result = await this.followersService.unfollow({ followerId, userId });
    return new OperationResultResponse.Dto({ result });
  }
}
