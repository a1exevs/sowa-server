import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./roles.model";
import { CreateRoleDTO } from "./DTO/CreateRoleDTO";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(DTO: CreateRoleDTO) {
    const role = await this.roleRepository.create(DTO);
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({where: {value}});
    return role;
  }
}
