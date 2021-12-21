import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User } from './users.model';
import { CreateUserDto } from "./DTO/CreateUser";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(DTO: CreateUserDto){
    const user = await this.userRepository.create(DTO);
    return user;
  }

  async getAllUsers(){
    const users = await this.userRepository.findAll();
    return users;
  }

}
