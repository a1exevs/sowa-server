import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {AuthModule} from "../auth/auth.module";
import {User} from "../users/users.model";
import { Contact } from "./contact.model";
import { UsersModule } from "../users/users.module";
import {Avatar} from "./avatar.model";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    SequelizeModule.forFeature([Profile, Contact, Avatar]),
    AuthModule,
    UsersModule
  ]
})
export class ProfileModule {}
