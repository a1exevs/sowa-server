import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {Profile} from "./profile.model";
import { Contact } from "./contact.model";
import { GetProfileResDTO } from "./ResDTO/GetProfileResDTO";
import { GetContactResDto } from "./ResDTO/GetContactResDto";
import { UsersService } from "../users/users.service";
import {Avatar} from "./avatar.model";
import {GetPhotosResDTO} from "./ResDTO/GetPhotosResDTO";
import {UserCommonInfoService} from "./userCommonInfo.service";
import {UserContactsService} from "./userContacts.service";
import {UserAvatarsService} from "./userAvatars.service";

@Injectable()
export class ProfileService {
    constructor(private userCommonInfoService: UserCommonInfoService,
                private userContactsService: UserContactsService,
                private userAvatarsService: UserAvatarsService,
                private usersService: UsersService) {}

    public async getUserProfile(userId: string) : Promise<GetProfileResDTO> {
        const user = await this.usersService.getUserById(Number(userId));
        if(!user)
            throw new HttpException(`Пользователь с идентификатором ${userId} не найден`, HttpStatus.BAD_REQUEST);

        const profile = await this.userCommonInfoService.getCommonInfoByUserId(userId);
        const contact = await this.userContactsService.getContactsByUserId(userId);
        const avatar = await this.userAvatarsService.getAvatarByUserId(userId);

        return this.buildGetProfileResponse(profile, contact, avatar);
    }

    private buildGetProfileResponse(profile: Profile, contact: Contact, avatar: Avatar) : GetProfileResDTO
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

        const avatar_response = new GetPhotosResDTO();
        if(avatar)
        {
            avatar_response.small = avatar.small;
            avatar_response.large = avatar.large;
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
        response.photos = avatar_response;
        return response;
    }
}
