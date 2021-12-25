import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/DTO/CreateUser";
import { Role } from "../roles/roles.model";
import { RegisterResponseDto } from "./DTO/Register";

@ApiTags("Авторизация")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Авторизация пользователя"})
  //@ApiResponse({status: 201, type: Role})
  @Post('/login')
  login(@Body() dto: CreateUserDto)
  {
    return this.authService.login(dto);
  }

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResponse({status: 201, type: RegisterResponseDto})
  @Post('/registration')
  registration(@Body() dto: CreateUserDto)
  {
    return this.authService.registration(dto);
  }
}
