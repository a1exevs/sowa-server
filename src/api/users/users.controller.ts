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
  HttpException, HttpStatus, ParseIntPipe
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import {RolesGuard} from "../auth/guards/roles.quard";
import {Roles} from "../auth/decorators/authRoles.decorator";
import { AddUserRoleDTO } from "./ReqDTO/AddUserRoleDTO";
import { BanUserDTO } from "./ReqDTO/BanUserDTO";
import { RefreshTokenGuard } from "../auth/guards/refreshToken.guard";
import { SetUserStatusDTO } from "./ReqDTO/SetUserStatusDTO";
import { GetUsersQuery } from "./queries/GetUsersQuery"
import { GetUsersResDto } from "./ResDTO/GetUsersResDto";

@ApiTags("Пользователи")
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: "Получение пользователей"})
  @ApiResponse({status: 200, type: GetUsersResDto})
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get()
  getUsers(@Query() queryParams: GetUsersQuery) {
    if((queryParams.page && queryParams.page < 0) || (queryParams.count && queryParams.count < 0))
      throw new HttpException("An error has occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    return this.usersService.getUsers(queryParams.page && queryParams.page > 0 ? queryParams.page : 1,
                                      queryParams.count && queryParams.count > 0 ? queryParams.count : 10);
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
  getStatus(@Param('userId', ParseIntPipe) userId: number): Promise<User>{
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
