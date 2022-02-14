import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/authRoles.decorator";

@Injectable()
export class RefreshTokenGuard implements CanActivate{
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookies = request.cookies;
      if(!("refresh_token" in cookies))
        throw new UnauthorizedException({message: 'Пользователь не авторизован'});

      return true;
    }
    catch (e)
    {
      console.log(e);
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }

}