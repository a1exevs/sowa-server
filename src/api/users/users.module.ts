import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { FollowersModule } from "../followers/followers.module";
import { FollowersService } from "../followers/followers.service";
import { ProfileModule } from "../profile/profile.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User]),
    RolesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => FollowersModule),
    forwardRef( () => ProfileModule)
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
