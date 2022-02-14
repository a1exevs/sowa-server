import { Get, HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./users.model";
import { CreateUserDTO } from "./ReqDTO/CreateUserDTO";
import { RolesService } from "../roles/roles.service";
import { AddUserRoleDTO } from "./ReqDTO/AddUserRoleDTO";
import { BanUserDTO } from "./ReqDTO/BanUserDTO";
import { SetUserStatusDTO } from "./ReqDTO/SetUserStatusDTO";
import { GetUsersResDto } from "./ResDTO/GetUsersResDto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              private roleService: RolesService) {
  }

  async createUser(DTO: CreateUserDTO) {
    let user;
    try {
      user = await this.userRepository.create(DTO);
    } catch (e) {
      throw new HttpException(`Не удалось создать пользователя. ${e.message}`, HttpStatus.BAD_REQUEST);
    }
    const role = await this.roleService.getRoleByValue("user");
    await user.$set("roles", [role.id]);
    user.roles = [role];
    return user;
  }

  async getUsers(page: number = 1, count: number = 10) {
    const response = new GetUsersResDto();
    if(count > 100)
    {
      response.error = "Максимальный размер страницы - 100 пользователей";
      return response;
    }
    const users: User[] =  await this.userRepository.findAll({ include: { all: true }, offset: Number(((page-1)*count)), limit: Number(count)});
    const totalCount = await this.userRepository.count();
    response.items = users;
    response.totalCount = totalCount;
    return response;
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }, include: { all: true } });
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id }, include: { all: true } });
  }

  async addRole(dto: AddUserRoleDTO) {
    const user = await this.userRepository.findByPk(dto.userID, { include: { all: true } });
    const hasRole = user.roles.some(role => role.value == dto.value);
    if (hasRole)
      throw new HttpException(`Пользователь уже имеет роль ${dto.value}`, HttpStatus.NOT_ACCEPTABLE);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (user && role) {
      await user.$add("roles", role.id);
      return user;
    }
    throw new HttpException("Не удалось найти пользователя или роль", HttpStatus.NOT_FOUND);
  }

  async ban(dto: BanUserDTO) {
    const user = await this.userRepository.findByPk(dto.userID);
    if (user) {
      user.banned = true;
      user.banReason = dto.banReason;
      await user.save();
      return user;
    }
    throw new HttpException("Не удалось найти пользователя", HttpStatus.NOT_FOUND);
  }

  async getStatus(userId: number) {
    return await this.userRepository.findOne({ attributes: ["status"], where: { id: userId } });
  }

  async setStatus(dto: SetUserStatusDTO, userId: number) {
    return await this.userRepository.update({ status: dto.status }, { where: { id: userId } });
  }
}
