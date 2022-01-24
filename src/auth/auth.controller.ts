import { Body, Controller, Delete, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./DTO/LoginDto";
import { RegisterDto } from "./DTO/RegisterDto";
import {JwtAuthGuard} from "./guards/jwtAuth.guard";
import { Response, Request } from "express";
import {AuthenticationResponse} from "./DTO/AuthenticationResponse";

@ApiTags("Авторизация")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @Post('/registration')
  async registration(@Body() dto: RegisterDto, @Res() response: Response)
  {
    const registerResult = await this.authService.registration(dto);
    if("refresh_token" in registerResult.data.payload)
      response.cookie("refresh_token", registerResult.data.payload.refresh_token, {httpOnly: true});
    response.send(registerResult);
  }

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() response: Response)
  {
    const loginResult = await this.authService.login(dto);
    if("refresh_token" in loginResult.data.payload)
      response.cookie("refresh_token", loginResult.data.payload.refresh_token, {httpOnly: true});
    response.send(loginResult);
  }

  @ApiOperation({summary: "Обновление данных пользователя"})
  @ApiResponse({status: 201, type: AuthenticationResponse})
  @Post('/refresh')
  refresh(@Req() request: Request)
  {
    if("refresh_token" in request.cookies)
      return this.authService.refresh(request.cookies.refresh_token);
    throw new UnauthorizedException({message: 'Пользователь не авторизован'});
  }

  @ApiOperation({summary: "Получение данные текущего пользователя"})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() request) {
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
}