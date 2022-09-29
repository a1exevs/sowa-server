import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Req,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {RolesGuard} from "../common/guards/roles.quard";
import {Roles} from "../common/decorators/auth-roles.decorator";
import { AddRoleRequest } from "./dto/add-role.request";
import { BanUserRequest } from "./dto/ban-user.request";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { SetUserStatusRequest } from "./dto/set-user-status.request";
import { GetUsersQuery } from "./queries/get-users.query"
import { GetUsersResponse } from "./dto/get-users.response";
import { Routes } from "../common/constants/routes";
import { ParsePositiveIntPipe } from "../common/pipes/parse-positive-int.pipe";
import { OperationResultResponse } from "../common/dto/operation-result.response";

@ApiTags("Пользователи")
@Controller(Routes.ENDPOINT_USERS)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: "Получение пользователей"})
  @ApiOkResponse({ type: GetUsersResponse.Swagger.GetUsersResponseData })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get()
  getUsers(
    @Query() queryParams: GetUsersQuery.Swagger.GetUsersQueryParams,
    @Req() request
  ): Promise<GetUsersResponse.Data> {
    const userId = request.user.id
    return this.usersService.getUsers(
      queryParams.page ?? 1,
      queryParams.count ?? 10,
      userId
    );
  }

  @ApiOperation({summary: "Выдача роли пользователю"})
  @ApiResponse({status: 201, type: User})
  @Roles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleRequest.Dto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({summary: "Бан пользователя"})
  @ApiResponse({status: 201, type: User})
  @Roles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserRequest.Dto) {
    return this.usersService.ban(dto);
  }

  @ApiOperation({summary: "Статус пользователя"})
  @ApiResponse({status: 200, type: String})
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get('/status/:userId')
  getStatus(@Param('userId', ParsePositiveIntPipe) userId: number): Promise<{ status: string }>{
    return this.usersService.getStatus(userId);
  }

  @ApiOperation({summary: "Установить статус пользователю"})
  @ApiResponse({status: 201, type: OperationResultResponse.Swagger.OperationResultResponseDto })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Put('/status')
  async setStatus(@Req() request, @Body() dto: SetUserStatusRequest.Dto) {
     await this.usersService.setStatus(dto, request.user.id);
     return new OperationResultResponse.Dto({ result: true });
  }
}
