import { Controller, Get, Post, Body, UseGuards, Param, Put, Req, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '@users/users.service';
import { User } from '@users/users.model';
import { JwtAuthGuard, RolesGuard, RefreshTokenGuard } from '@common/guards';
import { AuthRoles } from '@common/decorators';
import { AddRoleRequest, BanUserRequest, SetUserStatusRequest, GetUsersResponse } from '@users/dto';
import { GetUsersQuery } from '@users/queries';
import { Routes } from '@common/constants';
import { ParsePositiveIntPipe } from '@common/pipes';
import { OperationResultResponse } from '@common/dto';

@ApiTags('Пользователи')
@Controller(Routes.ENDPOINT_USERS)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение пользователей' })
  @ApiOkResponse({ type: GetUsersResponse.Swagger.GetUsersResponseData })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get()
  getUsers(
    @Query() queryParams: GetUsersQuery.Swagger.GetUsersQueryParams,
    @Req() request,
  ): Promise<GetUsersResponse.Data> {
    const userId = request.user.id;
    return this.usersService.getUsers(queryParams.page ?? 1, queryParams.count ?? 10, userId);
  }

  @ApiOperation({ summary: 'Выдача роли пользователю' })
  @ApiResponse({ status: 201, type: User })
  @AuthRoles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleRequest.Dto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Бан пользователя' })
  @ApiResponse({ status: 201, type: User })
  @AuthRoles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserRequest.Dto) {
    return this.usersService.ban(dto);
  }

  @ApiOperation({ summary: 'Статус пользователя' })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get('/status/:userId')
  getStatus(@Param('userId', ParsePositiveIntPipe) userId: number): Promise<{ status: string }> {
    return this.usersService.getStatus(userId);
  }

  @ApiOperation({ summary: 'Установить статус пользователю' })
  @ApiResponse({ status: 201, type: OperationResultResponse.Swagger.OperationResultResponseDto })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Put('/status')
  async setStatus(@Req() request, @Body() dto: SetUserStatusRequest.Dto) {
    await this.usersService.setStatus(dto, request.user.id);
    return new OperationResultResponse.Dto({ result: true });
  }
}
