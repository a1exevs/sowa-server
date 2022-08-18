import { Controller, Get, Req, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SecurityService } from "./security.service";
import { CommonResDTO } from "../common/ResDTO/CommonResDTO";
import { ResponseInterceptor } from "../common/interceptors/ResponseInterceptor";
import { ISession } from "../auth/interfaces/ISession";
import { Routes } from "../common/constants/routes";

@ApiTags("Безопасность")
@Controller(Routes.ENDPOINT_SECURITY)
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @ApiOperation({summary: "Получение ссылки на Капчу"})
  @ApiResponse({status: 200, type: CommonResDTO})
  @UseInterceptors(ResponseInterceptor)
  @Get('get-captcha-url')
  public async getCaptchaURL(@Req() request) {
    const { captchaURL, captchaText } = await this.securityService.getCaptchaURL();
    SecurityController.setSessionCaptchaText(request, captchaText);
    return { captchaURL };
  }

  private static setSessionCaptchaText(request, captchaText: string) {
    const session: ISession = request.session;
    session.captcha = captchaText;
  }
}
