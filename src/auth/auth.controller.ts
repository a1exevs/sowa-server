import { Body, Controller, Get, Post, Req, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDataResponseDTO } from "./DTO/AuthDataResponseDTO";
import { LoginDto } from "./DTO/LoginDto";
import { RefreshDto } from "./DTO/RefreshDto";
import { RegisterDto } from "./DTO/RegisterDto";

@ApiTags("Авторизация")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/registration')
  registration(@Body() dto: RegisterDto)
  {
    return this.authService.registration(dto);
  }

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/login')
  login(@Body() dto: LoginDto)
  {
    return this.authService.login(dto);
  }

  @ApiOperation({summary: "Обновление данных пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/refresh')
  refresh(@Body() dto: RefreshDto)
  {
    return this.authService.refresh(dto);
  }

  @ApiOperation({summary: "Возвращает данные текущего пользователя"})
  @ApiResponse({status: 200})
  @Get('/me')
  public async getUser (@Req() request) {
    const userId = request.user.id
    return this.authService.me(userId);
  }
}