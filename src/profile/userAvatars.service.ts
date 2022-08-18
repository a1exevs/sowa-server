import { Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Avatar} from "./avatar.model";
import {SetPhotosReqDTO} from "./ReqDTO/SetPhotosReqDto";

@Injectable()
export class UserAvatarsService {
    constructor(@InjectModel(Avatar) private avatarRepository: typeof Avatar) {}

    public async getAvatarByUserId(userId: number) : Promise<Avatar> {
        return await this.avatarRepository.findOne({ where: { userId } })
    }

    public async setAvatarData(dto: SetPhotosReqDTO, userId: number) : Promise<Avatar> {
        await this.avatarRepository.upsert({userId, ...dto})
        return await this.getAvatarByUserId(userId);
    }
}