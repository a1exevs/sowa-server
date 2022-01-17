import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./users.model";
import { CreateUserDTO } from "./DTO/CreateUserDTO";
import { RolesService } from "../roles/roles.service";
import { AddUserRoleDTO } from "./DTO/AddUserRoleDTO";
import { BanUserDTO } from "./DTO/BanUserDTO";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              private roleService: RolesService) {}

  async createUser(DTO: CreateUserDTO){
    let user;
    try {
      user = await this.userRepository.create(DTO);
    }
    catch (e) {
      throw new HttpException(`Не удалось создать пользователя. ${e.message}`, HttpStatus.BAD_REQUEST);
    }
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

  async getUserBuId(id: number){
    return await this.userRepository.findOne({ where: {id}})
  }

  async addRole(dto: AddUserRoleDTO) {
    const user = await this.userRepository.findByPk(dto.userID, {include: {all: true}});
    const hasRole = user.roles.some(role => role.value == dto.value);
    if(hasRole)
      throw new HttpException(`Пользователь уже имеет роль ${dto.value}`, HttpStatus.NOT_ACCEPTABLE);
    const role = await this.roleService.getRoleByValue(dto.value);
    if(user && role) {
      await user.$add('roles', role.id);
      return user;
    }
    throw new HttpException('Не удалось найти пользователя или роль', HttpStatus.NOT_FOUND);
  }

  async ban(dto: BanUserDTO) {
    const user = await this.userRepository.findByPk(dto.userID);
    if(user)
    {
      user.banned = true;
      user.banReason = dto.banReason;
      await user.save();
      return user;
    }
    throw new HttpException('Не удалось найти пользователя', HttpStatus.NOT_FOUND);
  }
}
