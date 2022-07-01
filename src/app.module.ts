import {Module} from "@nestjs/common";
import {UsersModule} from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UsersRoles} from "./users/users_roles.model";
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from "./posts/posts.model";
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path"
import {RefreshToken} from "./auth/refresh_tokens.model";
import { ProfileModule } from './profile/profile.module';
import {Profile} from "./profile/profile.model";
import { Contact } from "./profile/contact.model";
import {Avatar} from "./profile/avatar.model";
import {LoggerModule} from "./common/logs/logger.module";
import { SecurityModule } from './security/security.module';
import { FollowersModule } from './followers/followers.module';
import { Followers } from "./followers/followers.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../', process.env.SERVER_STATIC || "static")
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