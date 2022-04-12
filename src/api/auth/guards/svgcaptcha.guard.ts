import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

const MAX_AUTH_FAILED_COUNT = 5;

@Injectable()
export class SvgCaptchaGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if(request.session.authFailedCount >= MAX_AUTH_FAILED_COUNT)
    {
      /**
       * @todo При привышении порога MAX_AUTH_FAILED_COUNT:
       * 1) вернуть код 10 с требованием обратиться на /secure/getCaptcha
       * 2) проверять на наличие и равенство поля request.body.captcha == request.session.captca
       *
       * На /secure/getCaptcha:
       * 1) генерировать капчу, согласно коду ниже;
       * 2) возвращать на капчу ссылку;
       * 3) по таймеру удалять ее;
       */

      let svgCaptcha = require('svg-captcha');

      let captcha = svgCaptcha.create();

      request.session.captca = captcha.text;

      response.type('svg');
      response.status(HttpStatus.OK).send(captcha.data);
    }

    return true;
  }

}