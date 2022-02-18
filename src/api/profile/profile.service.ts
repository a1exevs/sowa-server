import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";

@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile) {}

    async getUserProfile(userId: string) {
        return await this.profileRepository.findOne({ where: { userId } })
    }
}
