import { Body, Controller, Delete, Get, Post, Req, Res, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { LoginRequest, RegisterRequest, AuthenticationResponse, GetCurrentUserResponse } from '@auth/dto';
import { JwtAuthGuard, RefreshTokenGuard } from '@common/guards';
import { SvgCaptchaGuard } from '@auth/guards';
import { UnauthorizedExceptionFilter } from '@auth/exception-filters';
import { IAuthenticationResult } from '@auth/interfaces';
import { ResponseInterceptor } from '@common/interceptors';
import { Routes } from '@common/constants';
import { ApiResult } from '@common/decorators';
import { HttpExceptionFilter } from '@common/exception-filters';
import { OperationResultResponse } from '@common/dto';

@ApiTags('Авторизация')
@Controller(Routes.ENDPOINT_AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResult({
    status: 201,
    type: AuthenticationResponse.Swagger.AuthenticationResponseDto,
    description: 'User was registered successful',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseInterceptors(ResponseInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Post('/registration')
  async registration(@Body() dto: RegisterRequest.Dto, @Res({ passthrough: true }) response: Response) {
    const registerResult: IAuthenticationResult = await this.authService.registration(dto);
    AuthController.setupCookies(response, registerResult);
    return new AuthenticationResponse.Dto({
      userId: registerResult.data.user.id,
      accessToken: registerResult.data.payload.accessToken,
    });
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResult({
    status: 201,
    type: AuthenticationResponse.Swagger.AuthenticationResponseDto,
    description: 'User was authorized successful',
  })
  @UseGuards(SvgCaptchaGuard)
  @UseFilters(HttpExceptionFilter, UnauthorizedExceptionFilter)
  @UseInterceptors(ResponseInterceptor)
  @Post('/login')
  async login(@Body() dto: LoginRequest.Dto, @Res({ passthrough: true }) response: Response, @Req() request) {
    const loginResult: IAuthenticationResult = await this.authService.login(dto);
    AuthController.setupCookies(response, loginResult);
    AuthController.resetAuthFailedCounter(request);
    return new AuthenticationResponse.Dto({
      userId: loginResult.data.user.id,
      accessToken: loginResult.data.payload.accessToken,
    });
  }

  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResult({
    status: 201,
    type: AuthenticationResponse.Swagger.AuthenticationResponseDto,
    description: 'Tokens were refreshed successful',
  })
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(ResponseInterceptor)
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshResult: IAuthenticationResult = await this.authService.refresh(request.cookies.refreshToken);
    AuthController.setupCookies(response, refreshResult);
    return new AuthenticationResponse.Dto({
      userId: refreshResult.data.user.id,
      accessToken: refreshResult.data.payload.accessToken,
    });
  }

  @ApiOperation({ summary: 'Получение данные текущего пользователя' })
  @ApiResult({
    status: 200,
    type: GetCurrentUserResponse.Swagger.GetCurrentUserResponseDto,
    description: 'Current user data was received successful',
  })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @UseInterceptors(ResponseInterceptor)
  @Get('/me')
  me(@Req() request): Promise<GetCurrentUserResponse.Dto> {
    const userId = request.user.id;
    return this.authService.me(userId);
  }

  @ApiOperation({ summary: 'Закрытие сессии' })
  @ApiResponse({ status: 200, type: OperationResultResponse.Swagger.OperationResultResponseDto })
  @UseGuards(JwtAuthGuard, RefreshTokenGuard)
  @Delete('/logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout(request.cookies.refreshToken);
    response.clearCookie('refreshToken');
    return new OperationResultResponse.Dto({ result });
  }

  private static setupCookies(response: Response, data: IAuthenticationResult) {
    if ('refreshToken' in data.data.payload) {
      response.cookie('refreshToken', data.data.payload.refreshToken, {
        httpOnly: true,
        expires: data.data.payload.refreshToken_expiration,
      }); // path: AUTH_PATH
    }
  }

  private static resetAuthFailedCounter(request) {
    const { session } = request;
    session.authFailedCount = null;
  }
}
