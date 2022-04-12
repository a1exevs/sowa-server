import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { sendResponse } from "../../common/helpers/exceptionfilters_helper";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    request.session.authFailedCount = request.session.authFailedCount ? ++request.session.authFailedCount : 1;

    sendResponse(exception, response);
  }
}
