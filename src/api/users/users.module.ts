import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import {Role} from "../roles/roles.model";
import {UsersRoles} from "./users_roles.model";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { Post } from "../posts/posts.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UsersRoles, Post]),
    RolesModule,
    forwardRef(() => AuthModule)
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
