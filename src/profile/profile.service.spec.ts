import { Test, TestingModule } from "@nestjs/testing";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { UserAvatarsService } from "./userAvatars.service";
import { UserCommonInfoService } from "./userCommonInfo.service";
import { UserContactsService } from "./userContacts.service";
import { UsersService } from "../users/users.service";
import { FilesService } from "../files/files.service";
import { Profile } from "./profile.model";
import { Avatar } from "./avatar.model";
import { Contact } from "./contact.model";
import { User } from "../users/users.model";
import { HttpException, HttpStatus } from "@nestjs/common";
import { sendPseudoError } from "../../test-helpers/tests-helper.spec";
import { SetProfileReqDTO } from "./ReqDTO/SetProfileReqDto";
import { loadTestFile, TEST_FILE_ORIGINAL_NAME, TEST_FILE_PATH } from "../../test-helpers/files-helper.spec";

describe('ProfileController', () => {
  let profileService: ProfileService;
  let userAvatarsService: UserAvatarsService;
  let userCommonInfoService: UserCommonInfoService;
  let userContactsService: UserContactsService;
  let usersService: UsersService;
  let filesService: FilesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: UserAvatarsService,
          useValue: {
            getAvatarByUserId: jest.fn(x => x),
            setAvatarData: jest.fn(x => x)
          }
        },
        {
          provide: UserCommonInfoService,
          useValue: {
            getCommonInfoByUserId: jest.fn(x => x),
            setCommonInfo: jest.fn(x => x)
          }
        },
        {
          provide: UserContactsService,
          useValue: {
            getContactsByUserId: jest.fn(x => x),
            setContacts: jest.fn(x => x)
          }
        },
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(x => x)
          }
        },
        {
          provide: FilesService,
          useValue: {
            addJPEGFile: jest.fn(x => x)
          }
        },
      ]
    }).compile();
    profileService = moduleRef.get<ProfileService>(ProfileService);
    userAvatarsService = moduleRef.get<UserAvatarsService>(UserAvatarsService);
    userCommonInfoService = moduleRef.get<UserCommonInfoService>(UserCommonInfoService);
    userContactsService = moduleRef.get<UserContactsService>(UserContactsService);
    usersService = moduleRef.get<UsersService>(UsersService);
    filesService = moduleRef.get<FilesService>(FilesService);
  });

  describe('ProfileService - definition', () => {
    it('ProfileService - should be defined', () => {
      expect(profileService).toBeDefined();
    });
    it('UserAvatarsService - should be defined', () => {
      expect(userAvatarsService).toBeDefined();
    });
    it('UserCommonInfoService - should be defined', () => {
      expect(userCommonInfoService).toBeDefined();
    });
    it('UserContactsService - should be defined', () => {
      expect(userContactsService).toBeDefined();
    });
    it('UsersService - should be defined', () => {
      expect(usersService).toBeDefined();
    });
    it('FilesService - should be defined', () => {
      expect(filesService).toBeDefined();
    });
  });

  describe('ProfileService - getProfile', () => {
    it('should be successful', async () => {
      const userId = 1;
      const fullName = 'lord Voldemort';
      const aboutMe = 'I am super wizard in the World';
      const lookingForAJob = false;
      const lookingForAJobDescription = "I don't need to work. I need to seize power in the world of magicians"
      const largeUploadedPhotoURL = 'sowa.com/profiles/1/large-photo';
      const smallUploadedPhotoURL = 'sowa.com/profiles/1/small-photo';
      const vk = 'volodya.vk.com';
      const facebook = 'volodya.facebook.com';
      const github = 'volodya.github.com';
      const twitter = 'volodya.twitter.com';
      const instagram = 'volodya.instagram.com';
      const mainLink = 'volodya.mainLink.com';
      const website = 'volodya.website.com';
      const youtube = 'volodya.youtube.com';
      const profile: Partial<Profile> = {
        fullName,
        aboutMe,
        lookingForAJob,
        lookingForAJobDescription
      }
      const avatar: Partial<Avatar> = {
        small: smallUploadedPhotoURL,
        large: largeUploadedPhotoURL
      }
      const contact: Partial<Contact> = {
        vk,
        facebook,
        github,
        twitter,
        instagram,
        mainLink,
        website,
        youtube
      }
      const user: Partial<User> = { id: userId }
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(user);
      })
      // @ts-ignore
      jest.spyOn(userCommonInfoService, 'getCommonInfoByUserId').mockImplementation(() => {
        return Promise.resolve(profile);
      })
      // @ts-ignore
      jest.spyOn(userAvatarsService, 'getAvatarByUserId').mockImplementation(() => {
        return Promise.resolve(avatar);
      })
      // @ts-ignore
      jest.spyOn(userContactsService, 'getContactsByUserId').mockImplementation(() => {
        return Promise.resolve(contact);
      })

      const profileData = await profileService.getUserProfile(userId);

      expect(profileData.fullName).toBe(fullName);
      expect(profileData.aboutMe).toBe(aboutMe);
      expect(profileData.lookingForAJob).toBe(lookingForAJob);
      expect(profileData.lookingForAJobDescription).toBe(lookingForAJobDescription);
      expect(profileData.contacts).toEqual(contact);
      expect(profileData.photos).toEqual(avatar);
      expect(usersService.getUserById).toBeCalledTimes(1);
      expect(usersService.getUserById).toBeCalledWith(userId);
      expect(userAvatarsService.getAvatarByUserId).toBeCalledTimes(1);
      expect(userAvatarsService.getAvatarByUserId).toBeCalledWith(userId);
      expect(userCommonInfoService.getCommonInfoByUserId).toBeCalledTimes(1);
      expect(userCommonInfoService.getCommonInfoByUserId).toBeCalledWith(userId);
      expect(userContactsService.getContactsByUserId).toBeCalledTimes(1);
      expect(userContactsService.getContactsByUserId).toBeCalledWith(userId);
    });
    it('should be successful result (with empty fields if data does not exist yet)', async () => {
      const userId = 1;
      const user: Partial<User> = { id: userId }
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(user);
      })
      // @ts-ignore
      jest.spyOn(userCommonInfoService, 'getCommonInfoByUserId').mockImplementation(() => {
        return Promise.resolve(null);
      })
      // @ts-ignore
      jest.spyOn(userAvatarsService, 'getAvatarByUserId').mockImplementation(() => {
        return Promise.resolve(null);
      })
      // @ts-ignore
      jest.spyOn(userContactsService, 'getContactsByUserId').mockImplementation(() => {
        return Promise.resolve(null);
      })

      const profileData = await profileService.getUserProfile(userId);

      expect(profileData.fullName).toBe('');
      expect(profileData.aboutMe).toBe('');
      expect(profileData.lookingForAJob).toBe(false);
      expect(profileData.lookingForAJobDescription).toBe('');
      expect(profileData.contacts.vk).toBe('');
      expect(profileData.contacts.github).toBe('');
      expect(profileData.contacts.facebook).toBe('');
      expect(profileData.contacts.twitter).toBe('');
      expect(profileData.contacts.instagram).toBe('');
      expect(profileData.contacts.mainLink).toBe('');
      expect(profileData.contacts.website).toBe('');
      expect(profileData.contacts.youtube).toBe('');
      expect(profileData.photos.large).toEqual('');
      expect(profileData.photos.small).toEqual('');
      expect(userAvatarsService.getAvatarByUserId).toBeCalledTimes(1);
      expect(userAvatarsService.getAvatarByUserId).toBeCalledWith(userId);
      expect(usersService.getUserById).toBeCalledTimes(1);
      expect(usersService.getUserById).toBeCalledWith(userId);
      expect(userCommonInfoService.getCommonInfoByUserId).toBeCalledTimes(1);
      expect(userCommonInfoService.getCommonInfoByUserId).toBeCalledWith(userId);
      expect(userContactsService.getContactsByUserId).toBeCalledTimes(1);
      expect(userContactsService.getContactsByUserId).toBeCalledWith(userId);
    })
    it('should throw exception (user with ID was not found', async () => {
      const userId = 2;
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(null);
      })

      try {
        await profileService.getUserProfile(userId);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`Пользователь с идентификатором ${userId} не найден`);
        expect(usersService.getUserById).toBeCalledTimes(1);
        expect(usersService.getUserById).toBeCalledWith(userId);
        expect(userAvatarsService.getAvatarByUserId).toBeCalledTimes(0);
        expect(userCommonInfoService.getCommonInfoByUserId).toBeCalledTimes(0);
        expect(userContactsService.getContactsByUserId).toBeCalledTimes(0);
      }
    })
  });

  describe('ProfileService - setUserProfile', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const fullName = 'lord Voldemort';
      const aboutMe = 'I am super wizard in the World';
      const lookingForAJob = false;
      const lookingForAJobDescription = "I don't need to work. I need to seize power in the world of magicians"
      const vk = 'volodya.vk.com';
      const facebook = 'volodya.facebook.com';
      const github = 'volodya.github.com';
      const twitter = 'volodya.twitter.com';
      const instagram = 'volodya.instagram.com';
      const mainLink = 'volodya.mainLink.com';
      const website = 'volodya.website.com';
      const youtube = 'volodya.youtube.com';
      const profile: Partial<Profile> = {
        fullName,
        aboutMe,
        lookingForAJob,
        lookingForAJobDescription
      }
      const contact: Partial<Contact> = {
        vk,
        facebook,
        github,
        twitter,
        instagram,
        mainLink,
        website,
        youtube
      }
      const user: Partial<User> = { id: userId }
      const dto: SetProfileReqDTO = {
        fullName,
        aboutMe,
        lookingForAJob,
        lookingForAJobDescription,
        contacts: {
          vk,
          facebook,
          github,
          twitter,
          instagram,
          mainLink,
          website,
          youtube
        }
      }

      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(user);
      })
      // @ts-ignore
      jest.spyOn(userCommonInfoService, 'setCommonInfo').mockImplementation(() => {
        return Promise.resolve(profile);
      })
      // @ts-ignore
      jest.spyOn(userContactsService, 'setContacts').mockImplementation(() => {
        return Promise.resolve(contact);
      })

      const profileData = await profileService.setUserProfile(userId, dto);

      expect(profileData.lookingForAJob).toBe(lookingForAJob);
      expect(profileData.lookingForAJobDescription).toBe(lookingForAJobDescription);
      expect(profileData.fullName).toBe(fullName);
      expect(profileData.aboutMe).toBe(aboutMe);
      expect(profileData.contacts).toEqual(contact);
      expect(usersService.getUserById).toBeCalledTimes(1);
      expect(usersService.getUserById).toBeCalledWith(userId);
      expect(userCommonInfoService.setCommonInfo).toBeCalledTimes(1);
      expect(userCommonInfoService.setCommonInfo).toBeCalledWith(userId, dto);
      expect(userContactsService.setContacts).toBeCalledTimes(1);
      expect(userContactsService.setContacts).toBeCalledWith(userId, dto.contacts);
      expect(userContactsService.getContactsByUserId).toBeCalledTimes(0);
    });
    it('should be successful result (without contacts data)', async () => {
      const userId = 1;
      const fullName = 'lord Voldemort';
      const aboutMe = 'I am super wizard in the World';
      const lookingForAJob = false;
      const lookingForAJobDescription = "I don't need to work. I need to seize power in the world of magicians"
      const profile: Partial<Profile> = {
        fullName,
        aboutMe,
        lookingForAJob,
        lookingForAJobDescription
      }
      const user: Partial<User> = { id: userId }
      const dto: SetProfileReqDTO = {
        fullName,
        aboutMe,
        lookingForAJob,
        lookingForAJobDescription,
      }

      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(user);
      })
      // @ts-ignore
      jest.spyOn(userCommonInfoService, 'setCommonInfo').mockImplementation(() => {
        return Promise.resolve(profile);
      })
      // @ts-ignore
      jest.spyOn(userContactsService, 'getContactsByUserId').mockImplementation(() => {
        return Promise.resolve(null);
      })

      const profileData = await profileService.setUserProfile(userId, dto);

      expect(profileData.lookingForAJob).toBe(lookingForAJob);
      expect(profileData.lookingForAJobDescription).toBe(lookingForAJobDescription);
      expect(profileData.fullName).toBe(fullName);
      expect(profileData.aboutMe).toBe(aboutMe);
      expect(profileData.contacts.mainLink).toBe('');
      expect(profileData.contacts.website).toBe('');
      expect(profileData.contacts.youtube).toBe('');
      expect(profileData.contacts.twitter).toBe('');
      expect(profileData.contacts.instagram).toBe('');
      expect(profileData.contacts.vk).toBe('');
      expect(profileData.contacts.github).toBe('');
      expect(profileData.contacts.facebook).toBe('');
      expect(usersService.getUserById).toBeCalledTimes(1);
      expect(usersService.getUserById).toBeCalledWith(userId);
      expect(userCommonInfoService.setCommonInfo).toBeCalledTimes(1);
      expect(userCommonInfoService.setCommonInfo).toBeCalledWith(userId, dto);
      expect(userContactsService.getContactsByUserId).toBeCalledTimes(1);
      expect(userContactsService.getContactsByUserId).toBeCalledWith(userId);
      expect(userContactsService.setContacts).toBeCalledTimes(0);
    });
    it('should throw exception (user with ID was not found)', async () => {
      const userId = 2;
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(null);
      })

      try {
        await profileService.setUserProfile(userId, null);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`Пользователь с идентификатором ${userId} не найден`);
        expect(usersService.getUserById).toBeCalledTimes(1);
        expect(usersService.getUserById).toBeCalledWith(userId);
        expect(userCommonInfoService.setCommonInfo).toBeCalledTimes(0);
        expect(userContactsService.setContacts).toBeCalledTimes(0);
        expect(userContactsService.getContactsByUserId).toBeCalledTimes(0);
      }
    });
  });

  describe('ProfileService - setUserProfilePhoto', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const user: Partial<User> = { id: userId }
      const photo = loadTestFile(TEST_FILE_PATH, 20000000, 'image/jpeg', TEST_FILE_ORIGINAL_NAME);
      const originalImageURL = 'originalImageURL';
      const smallImageURL = 'smallImageURL';
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(user);
      })
      jest.spyOn(filesService, 'addJPEGFile').mockImplementation(() => {
        return Promise.resolve({
          originalImageURL,
          originalImagePath: 'originalImagePath',
          smallImageURL,
          smallImagePath: 'smallImagePath'
        });
      })
      // @ts-ignore
      jest.spyOn(userAvatarsService, 'setAvatarData').mockImplementation(() => {
        return Promise.resolve({
          userId,
          large: originalImageURL,
          small: smallImageURL
        });
      })

      const profilePhotoData = await profileService.setUserProfilePhoto(photo, userId);

      expect(profilePhotoData.photos.small).toBe(smallImageURL);
      expect(profilePhotoData.photos.large).toBe(originalImageURL);
      expect(usersService.getUserById).toBeCalledTimes(1);
      expect(usersService.getUserById).toBeCalledWith(userId);
      expect(filesService.addJPEGFile).toBeCalledTimes(1);
      expect(filesService.addJPEGFile).toBeCalledWith(photo, '', `/users/${userId}/`);
      expect(userAvatarsService.setAvatarData).toBeCalledTimes(1);
      expect(userAvatarsService.setAvatarData).toBeCalledWith({ small: smallImageURL, large: originalImageURL }, userId);
    });
    it('should throw exception (user with ID was not found)', async () => {
      const userId = 1;
      const photo = loadTestFile(TEST_FILE_PATH, 20000000, 'image/jpeg', TEST_FILE_ORIGINAL_NAME);
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(null);
      })

      try {
        await profileService.setUserProfilePhoto(photo, userId);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`Пользователь с идентификатором ${userId} не найден`);
        expect(usersService.getUserById).toBeCalledTimes(1);
        expect(usersService.getUserById).toBeCalledWith(userId);
        expect(filesService.addJPEGFile).toBeCalledTimes(0);
        expect(userAvatarsService.setAvatarData).toBeCalledTimes(0);
      }
    });
    it('should throw exception (image adding error)', async () => {
      const userId = 1;
      const user: Partial<User> = { id: userId }
      const file = null;
      const errorMessage = `Файл не был выбран`;
      // @ts-ignore
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => {
        return Promise.resolve(user);
      })
      jest.spyOn(filesService, 'addJPEGFile').mockImplementation(() => {
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      })
      try {
        await profileService.setUserProfilePhoto(file, userId);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(errorMessage);
        expect(usersService.getUserById).toBeCalledTimes(1);
        expect(usersService.getUserById).toBeCalledWith(userId);
        expect(filesService.addJPEGFile).toBeCalledTimes(1);
        expect(filesService.addJPEGFile).toBeCalledWith(file, '', `/users/${userId}/`);
        expect(userAvatarsService.setAvatarData).toBeCalledTimes(0);
      }
    });
  });
});