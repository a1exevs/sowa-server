import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./roles.model";
import { CreateRoleRequest } from "./dto/create-role.request";
import { ErrorMessages } from "../common/constants/error-messages";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleRequest.Dto) {
    let role: Role;
    try {
      role = await this.roleRepository.create(dto);
    }
    catch (e) {
      throw new HttpException(`${ErrorMessages.ru.FAILED_TO_CREATE_ROLE}. ${e.message}`, HttpStatus.BAD_REQUEST);
    }
    return role;
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOne({ where: { value } });
  }
}
