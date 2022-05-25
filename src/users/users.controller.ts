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
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import {RolesGuard} from "../auth/guards/roles.quard";
import {Roles} from "../auth/decorators/authRoles.decorator";
import { AddUserRoleDTO } from "./ReqDTO/AddUserRoleDTO";
import { BanUserDTO } from "./ReqDTO/BanUserDTO";
import { RefreshTokenGuard } from "../auth/guards/refreshToken.guard";
import { SetUserStatusDTO } from "./ReqDTO/SetUserStatusDTO";
import { GetUsersQuery } from "./queries/GetUsersQuery"
import { GetUsersResponse } from "./ResDTO/get-users.response";
import { Routes } from "../common/constants/routes";
import { ParsePositiveIntPipe } from "../common/pipes/parse-positive-int.pipe";

@ApiTags("Пользователи")
@Controller(Routes.ENDPOINT_USERS)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: "Получение пользователей"})
  @ApiOkResponse({ type: GetUsersResponse.Swagger.GetUsersResponseData })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get()
  getUsers(
    @Query() queryParams: GetUsersQuery,
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
  addRole(@Body() dto: AddUserRoleDTO) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({summary: "Бан пользователя"})
  @ApiResponse({status: 201, type: User})
  @Roles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserDTO) {
    return this.usersService.ban(dto);
  }

  @ApiOperation({summary: "Статус пользователя"})
  @ApiResponse({status: 200, type: String})
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get('/status/:userId')
  getStatus(@Param('userId', ParsePositiveIntPipe) userId: number): Promise<User>{
    return this.usersService.getStatus(userId);
  }

  @ApiOperation({summary: "Установить статус пользователю"})
  @ApiResponse({status: 201, type: Boolean})
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Put('/status')
  async setStatus(@Req() request, @Body() dto: SetUserStatusDTO) {
     await this.usersService.setStatus(dto, request.user.id);
     return true;
  }
}
