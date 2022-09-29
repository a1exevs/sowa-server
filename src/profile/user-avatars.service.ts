import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserAvatar } from "./user-avatars.model";
import { SetUserAvatarRequest } from "./dto/set-user-avatar.request";

@Injectable()
export class UserAvatarsService {
  constructor(@InjectModel(UserAvatar) private avatarRepository: typeof UserAvatar) {}

  public async getAvatarByUserId(userId: number): Promise<UserAvatar> {
    return await this.avatarRepository.findOne({ where: { userId } });
  }

  public async setAvatarData(dto: SetUserAvatarRequest.Dto, userId: number): Promise<UserAvatar> {
    await this.avatarRepository.upsert({ userId, ...dto });
    return await this.getAvatarByUserId(userId);
  }
}