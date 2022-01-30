import { Body, Controller, Delete, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./DTO/LoginDto";
import { RegisterDto } from "./DTO/RegisterDto";
import {JwtAuthGuard} from "./guards/jwtAuth.guard";
import { Response, Request } from "express";
import {AuthenticationResponse} from "./DTO/AuthenticationResponse";

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
    this.setupCookies(response, registerResult);
    response.send(registerResult);
  }

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() response: Response)
  {
    const loginResult = await this.authService.login(dto);
    this.setupCookies(response, loginResult);
    response.send(loginResult);
  }

  @ApiOperation({summary: "Обновление данных пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response)
  {
    if("refresh_token" in request.cookies) {
      const refreshResult = await this.authService.refresh(request.cookies.refresh_token);
      this.setupCookies(response, refreshResult);
      response.send(refreshResult);
    }
    throw new UnauthorizedException({message: 'Пользователь не авторизован'});
  }

  @ApiOperation({summary: "Получение данные текущего пользователя"})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() request) {
    if(!("refresh_token" in request.cookies))
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    const userId = request.user.id
    return this.authService.me(userId);
  }

  @ApiOperation({summary: "Закрытие сессии"})
  @ApiResponse({status: 200, type: Boolean})
  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    if(!("refresh_token" in request.cookies))
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    const result = await this.authService.logout(request.cookies.refresh_token);
    response.clearCookie("refresh_token");
    response.send(Boolean(result));
  }

  private setupCookies(response: Response, data: AuthenticationResponse)
  {
    if("refresh_token" in data.data.payload)
      response.cookie("refresh_token",
        data.data.payload.refresh_token,
        {httpOnly: true, expires: data.data.payload.refresh_token_expiration}); //path: AUTH_PATH
  }
}