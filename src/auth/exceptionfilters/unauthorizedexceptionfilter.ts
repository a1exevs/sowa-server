import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { sendResponse } from "../../common/helpers/exceptionfilters_helper";
import { ResultCodes } from "../../common/constants/resultcodes";
import { ISession } from "../interfaces/ISession";
import { MAX_AUTH_FAILED_COUNT } from "../guards/svgcaptcha.guard";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const session: ISession = request.session;

    session.authFailedCount = session.authFailedCount ? ++session.authFailedCount : 1;

    if(session.authFailedCount >= MAX_AUTH_FAILED_COUNT) {
      sendResponse(exception, response, ResultCodes.NEED_CAPTCHA_AUTHORIZATION, ['Need authorization with captcha.']);
      return
    }

    sendResponse(exception, response);
  }
}
