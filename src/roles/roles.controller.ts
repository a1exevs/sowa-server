import { Controller, Get, Post, Body } from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { RolesService } from "./roles.service";

@ApiTags("Роли")
@Controller('roles')
export class RolesController {}