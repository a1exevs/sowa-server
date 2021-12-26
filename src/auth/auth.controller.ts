import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDTO } from "../users/DTO/CreateUserDTO";
import { Role } from "../roles/roles.model";
import { AuthDataResponseDTO } from "./DTO/AuthDataResponseDTO";

@ApiTags("Авторизация")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Авторизация пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/login')
  login(@Body() dto: CreateUserDTO)
  {
    return this.authService.login(dto);
  }

  @ApiOperation({summary: "Регистрация пользователя"})
  @ApiResponse({status: 201, type: AuthDataResponseDTO})
  @Post('/registration')
  registration(@Body() dto: CreateUserDTO)
  {
    return this.authService.registration(dto);
  }
}
