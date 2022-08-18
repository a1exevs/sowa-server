import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./roles.model";
import { CreateRoleDTO } from "./DTO/CreateRoleDTO";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(DTO: CreateRoleDTO) {
    let role: Role;
    try {
      role = await this.roleRepository.create(DTO);
    }
    catch (e) {
      throw new HttpException(`Не удалось создать роль. ${e.message}`, HttpStatus.BAD_REQUEST);
    }
    return role;
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOne({ where: { value } });
  }
}
