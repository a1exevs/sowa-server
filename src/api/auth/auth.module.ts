import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { RefreshTokensService } from "./refresh_tokens.service";
import { TokensService } from "./tokens.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { RefreshToken } from "./refresh_tokens.model";
import {User} from "../users/users.model";

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensService, TokensService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: '600s'
      }
    }),
    SequelizeModule.forFeature([RefreshToken, User])
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
