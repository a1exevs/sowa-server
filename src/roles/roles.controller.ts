import { Controller, Get, Post, Body, Injectable, Param } from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { User } from "../users/users.model";
import { CreateUserDto } from "../users/DTO/CreateUser";
import { Role } from "./roles.model";
import { CreateRoleDto } from "./DTO/CreateRole";

@ApiTags("Роли")
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({summary: "Создание роли"})
  @ApiResponse({status: 201, type: Role})
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({summary: "Получение роли по значению"})
  @ApiResponse({status: 200, type: Role})
  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}