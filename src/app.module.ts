import {Module} from "@nestjs/common";
import {UsersModule} from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [User],
      autoLoadModels: true,
    }),
    UsersModule,
  ],
})
export class AppModule {
}