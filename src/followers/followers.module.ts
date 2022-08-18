import { forwardRef, Module } from "@nestjs/common";
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { UsersModule } from "../users/users.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Followers } from "./followers.model";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [FollowersController],
  providers: [FollowersService],
  imports: [
    SequelizeModule.forFeature([Followers]),
    forwardRef(() => UsersModule),
    AuthModule
  ],
  exports: [
    FollowersService,
  ]
})
export class FollowersModule {}
