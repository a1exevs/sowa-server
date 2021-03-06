import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { sendResponse } from "../../helpers/exceptionfilters_helper";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    sendResponse(exception, response);
  }
}
