import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./DTO/LoginDto";
import { RegisterDto } from "./DTO/RegisterDto";
import {JwtAuthGuard} from "./guards/jwtAuth.guard";
import { Response, Request } from "express";
import {AuthenticationResponse} from "./DTO/AuthenticationResponse";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { SvgCaptchaGuard } from "./guards/svgcaptcha.guard";
import { UnauthorizedExceptionFilter } from "./exceptionfilters/unauthorizedexceptionfilter";

const AUTH_PATH: string = "auth"

@ApiTags("Авторизация")
@Controller(AUTH_PATH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @Post('/registration')
  async registration(@Body() dto: RegisterDto, @Res() response: Response)
  {
    const registerResult = await this.authService.registration(dto);
    AuthController.setupCookies(response, registerResult);
    response.send(registerResult);
  }

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @UseGuards(SvgCaptchaGuard)
  @UseFilters(UnauthorizedExceptionFilter)
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() response: Response, @Req() request)
  {
    const loginResult = await this.authService.login(dto);
    AuthController.setupCookies(response, loginResult);
    request.session.authFailedCount = undefined;
    response.send(loginResult);
  }

  @ApiOperation({summary: "Обновление данных пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response)
  {
    const refreshResult = await this.authService.refresh(request.cookies.refresh_token);
    AuthController.setupCookies(response, refreshResult);
    response.send(refreshResult);
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
  async logout(@Req() request: Request, @Res() response: Response) {
    const result = await this.authService.logout(request.cookies.refresh_token);
    response.clearCookie("refresh_token");
    response.send(Boolean(result));
  }

  private static setupCookies(response: Response, data: AuthenticationResponse)
  {
    if("refresh_token" in data.data.payload)
      response.cookie("refresh_token",
        data.data.payload.refresh_token,
        {httpOnly: true, expires: data.data.payload.refresh_token_expiration}); //path: AUTH_PATH
  }
}