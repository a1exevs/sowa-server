import {Module} from "@nestjs/common";
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersModule} from './users/users.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [],
      synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {
}