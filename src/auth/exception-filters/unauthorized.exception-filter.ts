import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';

import { sendResponse } from "@common/functions";
import { ResultCodes, ErrorMessages } from "@common/constants";
import { Isession } from "@auth/interfaces";
import { MAX_AUTH_FAILED_COUNT } from "@auth/guards";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const session: Isession = request.session;

    session.authFailedCount = session.authFailedCount ? ++session.authFailedCount : 1;

    if(session.authFailedCount >= MAX_AUTH_FAILED_COUNT) {
      sendResponse(exception, response, ResultCodes.NEED_CAPTCHA_AUTHORIZATION, [ErrorMessages.ru.NEED_AUTHORIZATION_WITH_CAPTCHA]);
      return
    }

    sendResponse(exception, response);
  }
}
