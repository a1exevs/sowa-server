import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import { Contact } from "./contact.model";
import { GetProfileResDTO } from "./ResDTO/GetProfileResDTO";
import { GetContactResDto } from "./ResDTO/GetContactResDto";
import { UsersService } from "../users/users.service";

@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                @InjectModel(Contact) private contactRepository: typeof Contact,
                private usersService: UsersService) {}

    public async getUserProfile(userId: string) : Promise<GetProfileResDTO> {
        const user = await this.usersService.getUserById(Number(userId));
        if(!user)
            throw new HttpException(`Пользователь с идентификатором ${userId} не найден`, HttpStatus.BAD_REQUEST);

        const profile = await this.profileRepository.findOne({ where: { userId } })
        const contact = await this.contactRepository.findOne({ where: { userId } })

        return this.buildGetProfileResponse(profile, contact);
    }

    private buildGetProfileResponse(profile: Profile, contact: Contact) : GetProfileResDTO
    {
        const contact_response = new GetContactResDto();
        if(contact)
        {
            contact_response.vk = contact.vk;
            contact_response.facebook = contact.facebook;
            contact_response.github = contact.github;
            contact_response.twitter = contact.twitter;
            contact_response.instagram = contact.instagram;
            contact_response.mainLink = contact.mainLink;
            contact_response.website = contact.website;
            contact_response.youtube = contact.youtube;
        }

        const response = new GetProfileResDTO();
        if(profile)
        {
            response.fullName = profile.fullName;
            response.aboutMe = profile.aboutMe;
            response.lookingForAJob = profile.lookingForAJob;
            response.lookingForAJobDescription = profile.lookingForAJobDescription;
        }
        response.contacts = contact_response;
        return response;
    }
}
