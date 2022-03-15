import { Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import { SetProfileReqDTO } from "./ReqDTO/SetProfileReqDto";

@Injectable()
export class UserCommonInfoService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile) {}

    public async getCommonInfoByUserId(userId: number) : Promise<Profile> {
        return await this.profileRepository.findOne({ where: { userId } })
    }

    public async setCommonInfo(userId: number, dto: SetProfileReqDTO)
    {
        await this.profileRepository.upsert({userId, ...dto}, {returning: true} )
        return await this.getCommonInfoByUserId(userId);
    }
}