import {Controller, Get, Post, Body, Param, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { Role } from "./roles.model";
import { CreateRoleRequest } from "./dto/create-role.request";
import {Roles} from "../common/decorators/auth-roles.decorator";
import {RolesGuard} from "../common/guards/roles.quard";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { Routes } from "../common/constants/routes";

@ApiTags("Роли")
@Controller(Routes.ENDPOINT_ROLES)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({summary: "Создание роли"})
  @ApiResponse({status: 201, type: Role})
  @Roles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Post()
  create(@Body() dto: CreateRoleRequest.Dto) : Promise<Role> {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({summary: "Получение роли по значению"})
  @ApiResponse({status: 200, type: Role})
  @Roles('admin')
  @UseGuards(RolesGuard, RefreshTokenGuard)
  @Get('/:value')
  getByValue(@Param('value') value: string) : Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }
}