import {Controller, Get, Post, Body, Param, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { Role } from "./roles.model";
import { CreateRoleDTO } from "./DTO/CreateRoleDTO";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {Roles} from "../auth/decorators/authRoles.decorator";
import {RolesGuard} from "../auth/guards/roles.quard";

@ApiTags("Роли")
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({summary: "Создание роли"})
  @ApiResponse({status: 201, type: Role})
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateRoleDTO) : Promise<Role> {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({summary: "Получение роли по значению"})
  @ApiResponse({status: 200, type: Role})
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/:value')
  getByValue(@Param('value') value: string) : Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }
}