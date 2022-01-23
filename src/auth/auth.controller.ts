import { Body, Controller, Delete, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDataResponseDTO } from "./DTO/AuthDataResponseDTO";
import { LoginDto } from "./DTO/LoginDto";
import { RegisterDto } from "./DTO/RegisterDto";
import {JwtAuthGuard} from "./guards/jwtAuth.guard";
import { Response, Request } from "express";

@ApiTags("Авторизация")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/registration')
  async registration(@Body() dto: RegisterDto, @Res() response: Response)
  {
    const registerData = await this.authService.registration(dto);
    if("refresh_token" in registerData.data.payload)
      response.cookie("refresh_token", registerData.data.payload.refresh_token, {httpOnly: true});
    response.send(registerData);
  }

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() response: Response)
  {
    const loginData = await this.authService.login(dto);
    if("refresh_token" in loginData.data.payload)
      response.cookie("refresh_token", loginData.data.payload.refresh_token, {httpOnly: true});
    response.send(loginData);
  }

  @ApiOperation({summary: "Обновление данных пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/refresh')
  refresh(@Req() request: Request)
  {
    if("refresh_token" in request.cookies)
      return this.authService.refresh(request.cookies.refresh_token);
    throw new UnauthorizedException({message: 'Пользователь не авторизован'});
  }

  @ApiOperation({summary: "Возвращает данные текущего пользователя"})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() request) {
    const userId = request.user.id
    return this.authService.me(userId);
  }

  @ApiOperation({summary: "Закрывает сессию"})
  @ApiResponse({status: 200, type: Boolean})
  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    if(!("refresh_token" in request.cookies))
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    const result = await this.authService.logout(request.cookies.refresh_token);
    response.clearCookie("refresh_token");
    const res = Boolean(result);
    response.send({result: res});
  }
}