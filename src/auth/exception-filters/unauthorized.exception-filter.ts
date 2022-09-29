import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { sendResponse } from "../../common/functions/exception-filters.functions";
import { ResultCodes } from "../../common/constants/result-codes";
import { Isession } from "../interfaces/isession";
import { MAX_AUTH_FAILED_COUNT } from "../guards/svg-captcha.guard";
import { ErrorMessages } from "../../common/constants/error-messages";

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
