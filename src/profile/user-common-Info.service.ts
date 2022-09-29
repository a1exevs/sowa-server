import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserCommonInfo } from "./user-common-info.model";
import { SetProfileRequest } from "./dto/set-profile.request";

@Injectable()
export class UserCommonInfoService {
  constructor(@InjectModel(UserCommonInfo) private profileRepository: typeof UserCommonInfo) {}

  public async getCommonInfoByUserId(userId: number): Promise<UserCommonInfo> {
    return await this.profileRepository.findOne({ where: { userId } });
  }

  public async setCommonInfo(userId: number, dto: SetProfileRequest.Dto) {
    await this.profileRepository.upsert({ userId, ...dto }, { returning: true });
    return await this.getCommonInfoByUserId(userId);
  }
}