import { Body, Controller, Delete, Get, Post, Req, Res, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./DTO/LoginDto";
import { RegisterDto } from "./DTO/RegisterDto";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { Request, Response } from "express";
import { AuthenticationResponse } from "./DTO/AuthenticationResponse";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { SvgCaptchaGuard } from "./guards/svgcaptcha.guard";
import { UnauthorizedExceptionFilter } from "./exceptionfilters/unauthorizedexceptionfilter";
import { ISession } from "./interfaces/ISession";
import { AuthenticationResDto } from "./DTO/AuthenticationResDto";
import { ResponseInterceptor } from "../common/interceptors/ResponseInterceptor";
import { Routes } from "../common/constants/routes";
import { ApiResult } from "./decorators/api-result.decorator";
import { HttpExceptionFilter } from "../common/exceptions/filters/httpexceptionfilter";

@ApiTags("Авторизация")
@Controller(Routes.ENDPOINT_AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResult({status: 201, type: AuthenticationResDto, description: 'User was registered successful'})
  @ApiBadRequestResponse( {description: "Bad request"} )
  @UseInterceptors(ResponseInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Post('/registration')
  async registration(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response)
  {
    const registerResult: AuthenticationResponse = await this.authService.registration(dto);
    AuthController.setupCookies(response, registerResult);
    return new AuthenticationResDto(registerResult.data.user.id, registerResult.data.payload.access_token);
  }

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResDto})
  @UseGuards(SvgCaptchaGuard)
  @UseFilters(HttpExceptionFilter, UnauthorizedExceptionFilter)
  @UseInterceptors(ResponseInterceptor)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response, @Req() request)
  {
    const loginResult: AuthenticationResponse = await this.authService.login(dto);
    AuthController.setupCookies(response, loginResult);
    AuthController.resetAuthFailedCounter(request);
    return new AuthenticationResDto(loginResult.data.user.id, loginResult.data.payload.access_token);
  }

  @ApiOperation({summary: "Обновление данных пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResDto})
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(ResponseInterceptor)
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response)
  {
    const refreshResult: AuthenticationResponse = await this.authService.refresh(request.cookies.refresh_token);
    AuthController.setupCookies(response, refreshResult);
    return new AuthenticationResDto(refreshResult.data.user.id, refreshResult.data.payload.access_token);
  }

  @ApiOperation({summary: "Получение данные текущего пользователя"})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Get('/me')
  me(@Req() request) {
    const userId = request.user.id
    return this.authService.me(userId);
  }

  @ApiOperation({summary: "Закрытие сессии"})
  @ApiResponse({status: 200, type: Boolean})
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Delete('/logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result: boolean = await this.authService.logout(request.cookies.refresh_token);
    response.clearCookie("refresh_token");
    return result;
  }

  private static setupCookies(response: Response, data: AuthenticationResponse)
  {
    if("refresh_token" in data.data.payload)
      response.cookie("refresh_token",
        data.data.payload.refresh_token,
        {httpOnly: true, expires: data.data.payload.refresh_token_expiration}); //path: AUTH_PATH
  }

  private static resetAuthFailedCounter(request) {
    const session: ISession = request.session;
    session.authFailedCount = null;
  }
}