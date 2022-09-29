import { forwardRef, Module } from "@nestjs/common";
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {UserCommonInfo} from "./user-common-info.model";
import {AuthModule} from "../auth/auth.module";
import { UserContact } from "./user-contacts.model";
import { UsersModule } from "../users/users.module";
import {UserAvatar} from "./user-avatars.model";
import {UserCommonInfoService} from "./user-common-Info.service";
import {UserAvatarsService} from "./user-avatars.service";
import {UserContactsService} from "./user-contacts.service";
import { FilesModule } from "../files/files.module";

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, UserCommonInfoService, UserContactsService, UserAvatarsService],
  imports: [
    SequelizeModule.forFeature([UserCommonInfo, UserContact, UserAvatar]),
    AuthModule,
    forwardRef(() => UsersModule),
    FilesModule
  ],
  exports: [
    ProfilesService
  ]
})
export class ProfilesModule {}
