import { Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";

@Injectable()
export class UserCommonInfoService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile) {}

    public async getCommonInfoByUserId(userId: string) : Promise<Profile> {
        return await this.profileRepository.findOne({ where: { userId } })
    }
}