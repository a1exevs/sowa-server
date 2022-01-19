import {Controller, Get, Post, Body, Param, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { Role } from "./roles.model";
import { CreateRoleDTO } from "./DTO/CreateRoleDTO";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";

@ApiTags("Роли")
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({summary: "Создание роли"})
  @ApiResponse({status: 201, type: Role})
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRoleDTO) : Promise<Role> {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({summary: "Получение роли по значению"})
  @ApiResponse({status: 200, type: Role})
  @Get('/:value')
  getByValue(@Param('value') value: string) : Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }
}