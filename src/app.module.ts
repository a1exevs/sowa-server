import {Module} from "@nestjs/common";
import {UsersModule} from './api/users/users.module';
import {ConfigModule} from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./api/users/users.model";
import { RolesModule } from './api/roles/roles.module';
import {Role} from "./api/roles/roles.model";
import {UsersRoles} from "./api/users/users_roles.model";
import { AuthModule } from './api/auth/auth.module';
import { PostsModule } from './api/posts/posts.module';
import { Post } from "./api/posts/posts.model";
import { FilesModule } from './api/files/files.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path"
import {RefreshToken} from "./api/auth/refresh_tokens.model";
import { ProfileModule } from './api/profile/profile.module';
import {Profile} from "./api/profile/profile.model";
import { Contact } from "./api/profile/contact.model";
import {Avatar} from "./api/profile/avatar.model";
import {LoggerModule} from "./api/common/logs/logger.module";
import { SecurityModule } from './api/security/security.module';
import { FollowersModule } from './api/followers/followers.module';
import { Followers } from "./api/followers/followers.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, process.env.SERVER_STATIC || "static")
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [User, Role, UsersRoles, Post, RefreshToken, Profile, Contact, Avatar, Followers],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule,
    ProfileModule,
    LoggerModule,
    SecurityModule,
    FollowersModule
  ],
})

export class AppModule {
}