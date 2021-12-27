import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./DTO/CreateUserDTO";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import {RolesGuard} from "../auth/guards/roles.quard";
import {Roles} from "../auth/decorators/authRoles.decorator";

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
}
