import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { sendResponse } from "../../common/functions/exception-filters.functions";
import { ResultCodes } from "../../common/constants/result-codes";
import { LoginRequest } from "../dto/login.request";
import { Isession } from "../interfaces/isession";
import { ErrorMessages } from "../../common/constants/error-messages";

export const MAX_AUTH_FAILED_COUNT = 5;

@Injectable()
export class SvgCaptchaGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const session: Isession = request.session;
    const body: LoginRequest.Dto = request.body;
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
        [ErrorMessages.ru.NEED_AUTHORIZATION_WITH_CAPTCHA]
      );
      return false;
    }

    return true;
  }

}