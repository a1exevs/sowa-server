
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CommonResDTO } from "../../api/common/ResDTO/CommonResDTO";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const body = new CommonResDTO();
    body.messages = [exception.message];
    body.resultCode = 1;
    response
      .status(status)
      .json(body);
  }
}