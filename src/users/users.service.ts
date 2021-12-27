import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User } from './users.model';
import { CreateUserDTO } from "./DTO/CreateUserDTO";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              private roleService: RolesService) {}

  async createUser(DTO: CreateUserDTO){
    const user = await this.userRepository.create(DTO);
    const role = await this.roleService.getRoleByValue('user');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers(){
    const users = await this.userRepository.findAll({include: {all: true}});
    return users;
  }

  async getUserByEmail(email: string){
    const user = await this.userRepository.findOne({where: {email},include: {all: true}});
    return user;
  }
}
