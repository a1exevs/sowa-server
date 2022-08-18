import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/sequelize";
import { UserContactsService } from "./userContacts.service";
import { Contact } from "./contact.model";

describe('UserContactsService', () => {
  let userContactsService: UserContactsService;
  let model: typeof Contact;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserContactsService,
        {
          provide: getModelToken(Contact),
          useValue: {
            findOne: jest.fn(x => x),
            upsert: jest.fn(x => x)
          }
        }
      ],
    }).compile();
    userContactsService = module.get<UserContactsService>(UserContactsService);
    model = module.get<typeof Contact>(getModelToken(Contact));
  });

  describe('UserContactsService - definition', () => {
    it('UserContactsService - should be defined', () => {
      expect(userContactsService).toBeDefined();
    });
    it('Contact - should be defined', () => {
      expect(model).toBeDefined();
    });
  });

  describe('UserContactsService - getContactsByUserId', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const vk = 'volodya.vk.com';
      const facebook = 'volodya.facebook.com';
      const github = 'volodya.github.com';
      const twitter = 'volodya.twitter.com';
      const instagram = 'volodya.instagram.com';
      const mainLink = 'volodya.mainLink.com';
      const website = 'volodya.website.com';
      const youtube = 'volodya.youtube.com';
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
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        return Promise.resolve({ userId, ...contact });
      })
      const contactsData = await userContactsService.getContactsByUserId(userId);

      expect(contactsData.userId).toBe(userId);
      expect(contactsData.vk).toBe(vk);
      expect(contactsData.facebook).toBe(facebook);
      expect(contactsData.github).toBe(github);
      expect(contactsData.twitter).toBe(twitter);
      expect(contactsData.instagram).toBe(instagram);
      expect(contactsData.mainLink).toBe(mainLink);
      expect(contactsData.website).toBe(website);
      expect(contactsData.youtube).toBe(youtube);
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ where: { userId }});
    });
  });

  describe('UserContactsService - setContacts', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const vk = 'volodya.vk.com';
      const facebook = 'volodya.facebook.com';
      const github = 'volodya.github.com';
      const twitter = 'volodya.twitter.com';
      const instagram = 'volodya.instagram.com';
      const mainLink = 'volodya.mainLink.com';
      const website = 'volodya.website.com';
      const youtube = 'volodya.youtube.com';
      const contactData = {
        vk,
        facebook,
        github,
        twitter,
        instagram,
        mainLink,
        website,
        youtube
      }
      const contact: Partial<Contact> = { userId, ...contactData }
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        return Promise.resolve(contact);
      })
      // @ts-ignore
      jest.spyOn(model, 'upsert').mockImplementation(() => {
        return Promise.resolve([true])
      })
      const result = await userContactsService.setContacts(userId, contactData);
      expect(result.userId).toBe(userId);
      expect(result.vk).toBe(vk);
      expect(result.facebook).toBe(facebook);
      expect(result.github).toBe(github);
      expect(result.twitter).toBe(twitter);
      expect(result.instagram).toBe(instagram);
      expect(result.mainLink).toBe(mainLink);
      expect(result.website).toBe(website);
      expect(result.youtube).toBe(youtube);
      expect(model.upsert).toBeCalledTimes(1);
      expect(model.upsert).toBeCalledWith({ ...contactData, userId }, { returning: true });
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ where: { userId }});
    });
  });
});