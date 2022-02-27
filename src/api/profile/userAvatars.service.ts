import { Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Avatar} from "./avatar.model";

@Injectable()
export class UserAvatarsService {
    constructor(@InjectModel(Avatar) private avatarRepository: typeof Avatar) {}

    public async getAvatarByUserId(userId: number) : Promise<Avatar> {
        return await this.avatarRepository.findOne({ where: { userId } })
    }
}