import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { ErrorMessages } from "../../common/constants/error-messages";

@Injectable()
export class RefreshTokenGuard implements CanActivate{
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookies = request.cookies;
      if(!("refresh_token" in cookies))
        throw new UnauthorizedException({message: ErrorMessages.ru.UNAUTHORIZED});

      return true;
    }
    catch (e)
    {
      console.log(e);
      throw new HttpException(ErrorMessages.ru.FORBIDDEN, HttpStatus.FORBIDDEN);
    }
  }

}