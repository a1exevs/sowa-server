import { Controller, Get, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./DTO/CreateUser";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { User } from "./users.model";

@ApiTags("Пользователи")
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: "Создание пользователя"})
  @ApiResponse({status: 201, type: User})
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({summary: "Получение всех пользователей"})
  @ApiResponse({status: 200, type: [User]})
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
