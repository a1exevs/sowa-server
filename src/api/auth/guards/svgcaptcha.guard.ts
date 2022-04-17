import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { sendResponse } from "../../common/helpers/exceptionfilters_helper";
import { ResultCodes } from "../../common/constants/resultcodes";
import { LoginDto } from "../DTO/LoginDto";
import { ISession } from "../interfaces/ISession";

const MAX_AUTH_FAILED_COUNT = 5;

@Injectable()
export class SvgCaptchaGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const session: ISession = request.session;
    const body: LoginDto = request.body;
    const captchaText = session.captcha;
    session.captcha = null;

    if(session.authFailedCount >= MAX_AUTH_FAILED_COUNT)
    {
      if(captchaText === body.captcha)
        return true

      sendResponse(
        new UnauthorizedException({message: ''}),
        response,
        ResultCodes.NEED_CAPTCHA_AUTHORIZATION,
        ['Need authorization with captcha.']
      );
    }

    return true;
  }

}