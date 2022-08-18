import { HttpExceptionFilter } from "../common/exceptions/filters/httpexceptionfilter";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { RefreshTokenGuard } from "../auth/guards/refreshToken.guard";
import { ResponseInterceptor } from "../common/interceptors/ResponseInterceptor";
import { Test, TestingModule } from "@nestjs/testing";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { JwtService } from "@nestjs/jwt";
import { GetProfileResDTO } from "./ResDTO/GetProfileResDTO";
import { SetProfileReqDTO } from "./ReqDTO/SetProfileReqDto";
import { loadTestFile, TEST_FILE_ORIGINAL_NAME, TEST_FILE_PATH } from "../../test-helpers/files-helper.spec";

describe('ProfileController', () => {
  let profileController: ProfileController;
  let profileService: ProfileService;
  let httpExceptionFilter: HttpExceptionFilter;
  let jwtAuthGuard: JwtAuthGuard;
  let refreshTokenGuard: RefreshTokenGuard;
  let responseInterceptor: ResponseInterceptor<any>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    const jwtService = { provide: JwtService, useValue: {} };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getUserProfile: jest.fn(x => x),
            setUserProfile: jest.fn(x => x),
            setUserProfilePhoto: jest.fn(x => x),
          }
        },
        jwtService
      ]
    }).compile();
    profileController = moduleRef.get<ProfileController>(ProfileController);
    profileService = moduleRef.get<ProfileService>(ProfileService);
    httpExceptionFilter = moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);
    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    refreshTokenGuard = moduleRef.get<RefreshTokenGuard>(RefreshTokenGuard);
    responseInterceptor = moduleRef.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  describe('ProfileController - definition', () => {
    it('ProfileController - should be defined', () => {
      expect(profileController).toBeDefined();
    });
    it('ProfileService - should be defined', () => {
      expect(profileService).toBeDefined();
    });
    it('HttpExceptionFilter - should be defined', () => {
      expect(httpExceptionFilter).toBeDefined();
    });
    it('JwtAuthGuard - should be defined', () => {
      expect(jwtAuthGuard).toBeDefined();
    });
    it('RefreshTokenGuard - should be defined', () => {
      expect(refreshTokenGuard).toBeDefined();
    });
    it('ResponseInterceptor - should be defined', () => {
      expect(responseInterceptor).toBeDefined();
    });
  });

  describe('ProfileController - getProfile', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const fullName = 'lord Voldemort';
      const aboutMe = 'I am super wizard in the World';
      const lookingForAJob = false;
      const lookingForAJobDescription = "I don't need to work. I need to seize power in the world of magicians"
      const contacts = null;
      const photos = null;
      jest.spyOn(profileService, 'getUserProfile').mockImplementation( (): Promise<GetProfileResDTO> => {
        return Promise.resolve({
          fullName,
          aboutMe,
          lookingForAJob,
          lookingForAJobDescription,
          contacts,
          photos
        })
      })

      const profileData = await profileController.getProfile(userId);

      expect(profileData.fullName).toBe(fullName);
      expect(profileData.aboutMe).toBe(aboutMe);
      expect(profileData.lookingForAJob).toBe(lookingForAJob);
      expect(profileData.lookingForAJobDescription).toBe(lookingForAJobDescription);
      expect(profileData.contacts).toBe(contacts);
      expect(profileData.photos).toBe(photos);
      expect(profileService.getUserProfile).toBeCalledTimes(1);
      expect(profileService.getUserProfile).toBeCalledWith(userId);
    })
  });

  describe('ProfileController - setProfile', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const fullName = 'lord Voldemort';
      const aboutMe = 'I am super wizard in the World';
      const lookingForAJob = false;
      const lookingForAJobDescription = "I don't need to work. I need to seize power in the world of magicians"
      const contacts = null;
      const photos = null;
      const requestDto: SetProfileReqDTO = {
        fullName,
        aboutMe,
        lookingForAJob,
        lookingForAJobDescription,
        contacts
      }
      jest.spyOn(profileService, 'setUserProfile').mockImplementation( (): Promise<GetProfileResDTO> => {
        return Promise.resolve({
          ...requestDto,
          contacts: requestDto.contacts,
          photos
        })
      })
      const req = { user: { id: userId } };

      const userProfile = await profileController.setProfile(requestDto, req);

      expect(userProfile.fullName).toBe(fullName);
      expect(userProfile.aboutMe).toBe(aboutMe);
      expect(userProfile.lookingForAJob).toBe(lookingForAJob);
      expect(userProfile.lookingForAJobDescription).toBe(lookingForAJobDescription);
      expect(userProfile.contacts).toBe(contacts);
      expect(userProfile.photos).toBe(photos);
      expect(profileService.setUserProfile).toBeCalledTimes(1);
      expect(profileService.setUserProfile).toBeCalledWith(userId, requestDto);
    })
  });

  describe('ProfileController - setProfilePhoto', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const req = { user: { id: userId } };
      const photo = loadTestFile(TEST_FILE_PATH, 20000000, 'image/jpeg', TEST_FILE_ORIGINAL_NAME);
      const largeUploadedPhotoURL = 'sowa.com/profiles/1/large-photo';
      const smallUploadedPhotoURL = 'sowa.com/profiles/1/small-photo';

      jest.spyOn(profileService, 'setUserProfilePhoto').mockImplementation(() => {
        return Promise.resolve({
          photos: {
            large: largeUploadedPhotoURL,
            small: smallUploadedPhotoURL
          }
        })
      })

      const result = await profileController.setProfilePhoto(photo, req);

      expect(result.photos.large).toBe(largeUploadedPhotoURL);
      expect(result.photos.small).toBe(smallUploadedPhotoURL);
      expect(profileService.setUserProfilePhoto).toBeCalledTimes(1);
      expect(profileService.setUserProfilePhoto).toBeCalledWith(photo, userId);
    })
  });
});