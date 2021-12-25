import { HttpStatus, HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../users/DTO/CreateUser";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { User } from "../users/users.model";
import { RegisterResponseDto } from "./DTO/Register";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private jwtService: JwtService) {}

  async login(dto: CreateUserDto) {

  }

  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if(candidate)
      throw new HttpException("Пользователь уже существуют", HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});
    return this.generateToken(user);
  }

  async generateToken(user: User)
  {
    const payload = {email: user.email, id: user.id, roles: user.roles};
    const response = new RegisterResponseDto;
    response.token = this.jwtService.sign(payload);
    return response;
  }
}
