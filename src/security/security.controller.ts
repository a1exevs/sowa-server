import { Controller, Get, Req, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SecurityService } from "./security.service";
import { CommonResponse } from "../common/dto/common.response";
import { ResponseInterceptor } from "../common/interceptors/response.Interceptor";
import { Isession } from "../auth/interfaces/isession";
import { Routes } from "../common/constants/routes";

@ApiTags("Безопасность")
@Controller(Routes.ENDPOINT_SECURITY)
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @ApiOperation({summary: "Получение ссылки на Капчу"})
  @ApiResponse({status: 200, type: CommonResponse.Swagger.CommonResponseDto})
  @UseInterceptors(ResponseInterceptor)
  @Get('get-captcha-url')
  public async getCaptchaURL(@Req() request) {
    const { captchaURL, captchaText } = await this.securityService.getCaptchaURL();
    SecurityController.setSessionCaptchaText(request, captchaText);
    return { captchaURL };
  }

  private static setSessionCaptchaText(request, captchaText: string) {
    const session: Isession = request.session;
    session.captcha = captchaText;
  }
}
