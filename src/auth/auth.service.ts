import { HttpStatus, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "../users/DTO/CreateUserDTO";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { User } from "../users/users.model";
import { AuthDataResponseDTO } from "./DTO/AuthDataResponseDTO";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService) {}

  async login(dto: CreateUserDTO) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDTO) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if(candidate)
      throw new HttpException("Пользователь уже существуют", HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});
    return this.generateToken(user);
  }

  private async generateToken(user: User)
  {
    const payload = {email: user.email, id: user.id, roles: user.roles};
    const response = new AuthDataResponseDTO;
    response.token = this.jwtService.sign(payload);
    return response;
  }

  private async validateUser(dto: CreateUserDTO)
  {
    const user = await this.userService.getUserByEmail(dto.email);
    if(user) {
      const passwordsEqual = await bcrypt.compare(dto.password, user.password);
      if (passwordsEqual)
        return user;
    }
    throw new UnauthorizedException({message: 'Неверный email или пароль'});
  }
}
