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
import { SetProfileReqDTO } from "./ReqDTO/SetProfileReqDto";
import { User } from "../users/users.model";
import { FilesService } from "../files/files.service";
import { CommonResDTO } from "../common/ResDTO/CommonResDTO";

@Injectable()
export class ProfileService {
    constructor(private userCommonInfoService: UserCommonInfoService,
                private userContactsService: UserContactsService,
                private userAvatarsService: UserAvatarsService,
                private usersService: UsersService,
                private fileService: FilesService) {}

    public async getUserProfile(userId: number) : Promise<GetProfileResDTO> {
        await this.validateUserId(userId);

        const profile = await this.userCommonInfoService.getCommonInfoByUserId(userId);
        const contact = await this.userContactsService.getContactsByUserId(userId);
        const avatar = await this.userAvatarsService.getAvatarByUserId(userId);

        return this.buildGetProfileResponse(profile, contact, avatar);
    }

    public async setUserProfile(userId: number, dto: SetProfileReqDTO) {
        await this.validateUserId(userId);

        const profile = await this.userCommonInfoService.setCommonInfo(userId, dto);
        let contacts = dto.contacts ? await this.userContactsService.setContacts(userId, dto.contacts) :
                                      await this.userContactsService.getContactsByUserId(userId);

        return this.buildGetProfileResponse(profile, contacts, null);
    }

    public async setUserProfilePhoto(image: any, userId: number) {
        await this.validateUserId(userId);
        const {originalImageURL, smallImageURL} = await this.fileService.addJPEGFile(image, "", `/users/${userId}/`);
        const avatars = await this.userAvatarsService.setAvatarData({small: smallImageURL, large: originalImageURL}, userId)

        return this.buildGetUserProfilePhotoResponse(avatars);
    }

    /**
     * Сформировать ответ на основе сущностей, связанных с информацией о пользователе,
     * с учетом возможности отсутствия в БД этих данных (например, для нового пользователя)
     * @param profile
     * @param contact
     * @param avatar
     * @private
     */
    private buildGetProfileResponse(profile: Profile, contact: Contact, avatar: Avatar) : GetProfileResDTO
    {
        const contact_response = new GetContactResDto();
        if(contact)
        {
            contact_response.vk = contact.vk ?? "";
            contact_response.facebook = contact.facebook ?? "";
            contact_response.github = contact.github ?? "";
            contact_response.twitter = contact.twitter ?? "";
            contact_response.instagram = contact.instagram ?? "";
            contact_response.mainLink = contact.mainLink ?? "";
            contact_response.website = contact.website ?? "";
            contact_response.youtube = contact.youtube ?? "";
        }

        const avatar_response = new GetPhotosResDTO();
        if(avatar)
        {
            avatar_response.small = avatar.small ?? "";
            avatar_response.large = avatar.large ?? "";
        }

        const response = new GetProfileResDTO();
        if(profile)
        {
            response.fullName = profile.fullName ?? "";
            response.aboutMe = profile.aboutMe ?? "";
            response.lookingForAJob = profile.lookingForAJob ?? false;
            response.lookingForAJobDescription = profile.lookingForAJobDescription ?? "";
        }

        response.contacts = contact_response;
        response.photos = avatar_response;
        return response;
    }

    private async validateUserId(userId: number) : Promise<User> {
        const user = await this.usersService.getUserById(Number(userId));
        if(!user)
            throw new HttpException(`Пользователь с идентификатором ${userId} не найден`, HttpStatus.BAD_REQUEST);
        return user;
    }

    /**
     * Сформировать ответ на основе данных о фотографиях профиля пользователя
     * с учетом возможности отсутствия в БД этих данных (например, для нового пользователя)
     * @param avatars
     * @private
     */
    private buildGetUserProfilePhotoResponse(avatars: Avatar) : { photos }
    {
        const photos_response = new GetPhotosResDTO();
        if(avatars)
        {
            photos_response.small = avatars.small ?? "";
            photos_response.large = avatars.large ?? "";
        }

        return { photos: photos_response };
    }
}
