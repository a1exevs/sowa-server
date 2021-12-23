import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {RolesController} from "./roles.controller";
import {RolesService} from "./roles.service";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UsersRoles} from "../users/users_roles.model";

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        SequelizeModule.forFeature([Role, User, UsersRoles])
    ]
})
export class RolesModule {}
