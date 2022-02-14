import {Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards, Put} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {GetUsersResDto} from "../users/ResDTO/GetUsersResDto";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {RefreshTokenGuard} from "../auth/guards/refreshToken.guard";
import {GetUsersQuery} from "../users/queries/GetUsersQuery";
import {User} from "../users/users.model";
import {Roles} from "../auth/decorators/authRoles.decorator";
import {RolesGuard} from "../auth/guards/roles.quard";
import {AddUserRoleDTO} from "../users/ReqDTO/AddUserRoleDTO";

@Controller('profile')
export class ProfileController {
    constructor() {}

    //@ApiOperation({summary: "Получение пользователей"})
    //@ApiResponse({status: 200, type: GetUsersResDto})
    //@UseGuards(JwtAuthGuard, RefreshTokenGuard)
    @Get()
    getProfile() {
        return "get Profile";
    }

    //@ApiOperation({summary: "Выдача роли пользователю"})
    //@ApiResponse({status: 201, type: User})
    //@Roles('admin')
    //@UseGuards(RolesGuard, RefreshTokenGuard)
    @Put()
    setProfile() {
        return "set Profile";
    }
}
