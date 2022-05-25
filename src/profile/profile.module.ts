import { forwardRef, Module } from "@nestjs/common";
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {AuthModule} from "../auth/auth.module";
import { Contact } from "./contact.model";
import { UsersModule } from "../users/users.module";
import {Avatar} from "./avatar.model";
import {UserCommonInfoService} from "./userCommonInfo.service";
import {UserAvatarsService} from "./userAvatars.service";
import {UserContactsService} from "./userContacts.service";
import { FilesModule } from "../files/files.module";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UserCommonInfoService, UserContactsService, UserAvatarsService],
  imports: [
    SequelizeModule.forFeature([Profile, Contact, Avatar]),
    AuthModule,
    forwardRef(() => UsersModule),
    FilesModule
  ],
  exports: [
    ProfileService
  ]
})
export class ProfileModule {}
