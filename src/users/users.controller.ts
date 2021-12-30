import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./DTO/CreateUserDTO";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import {RolesGuard} from "../auth/guards/roles.quard";
import {Roles} from "../auth/decorators/authRoles.decorator";
import { AddUserRoleDTO } from "./DTO/AddUserRoleDTO";
import { BanUserDTO } from "./DTO/BanUserDTO";

@ApiTags("Пользователи")
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: "Создание пользователя"})
  @ApiResponse({status: 201, type: User})
  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({summary: "Получение всех пользователей"})
  @ApiResponse({status: 200, type: [User]})
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({summary: "Выдача роли пользователю"})
  @ApiResponse({status: 201, type: User})
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddUserRoleDTO) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({summary: "Бан пользователя"})
  @ApiResponse({status: 201, type: User})
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserDTO) {
    return this.usersService.ban(dto);
  }
}
