import { Test, TestingModule } from "@nestjs/testing";
import { ProfileService} from "../profile/profile.service";
import { UsersService } from "./users.service";
import { User } from "./users.model";
import { RolesService } from "../roles/roles.service";
import { FollowersService } from "../followers/followers.service";
import { getModelToken } from "@nestjs/sequelize";
import { Role } from "../roles/roles.model";
import { CreateUserDTO } from "./ReqDTO/CreateUserDTO";
import { HttpException, HttpStatus } from "@nestjs/common";
import { mockUsers } from "../../test-helpers/users-helper.spec";
import { Followers } from "../followers/followers.model";
import { FindOptions } from "sequelize/dist/lib/model";
import { AddUserRoleDTO } from "./ReqDTO/AddUserRoleDTO";
import { sendPseudoError } from "../../test-helpers/tests-helper.spec";
import { BanUserDTO } from "./ReqDTO/BanUserDTO";
import { SetUserStatusDTO } from "./ReqDTO/SetUserStatusDTO";
import { UpdateOptions } from "sequelize";
import { ErrorMessages } from "../common/constants/error-messages";

jest.mock('../profile/profile.service.ts');
jest.mock('./users.model');

describe('UsersService', () => {
  let usersService: UsersService;
  let model: typeof User;
  let rolesService: RolesService;
  let followersService: FollowersService;
  let profileService: ProfileService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            create: jest.fn(x => x),
            $set: jest.fn(x => x),
            findAll: jest.fn(x => x),
            findOne: jest.fn(x => x),
            findByPk: jest.fn(x => x),
            count: jest.fn(x => x),
            update: jest.fn(x => x),
          }
        },
        {
          provide: RolesService,
          useValue: {
            getRoleByValue: jest.fn(x => x)
          }
        },
        {
          provide: FollowersService,
          useValue: {
            findFollowRows: jest.fn(x => x)
          }
        },
        {
          provide: ProfileService,
          useValue: {
            getUserProfile: jest.fn(x => x)
          }
        },
      ]
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    model = moduleRef.get<typeof User>(getModelToken(User));
    rolesService = moduleRef.get<RolesService>(RolesService);
    followersService = moduleRef.get<FollowersService>(FollowersService);
    profileService = moduleRef.get<ProfileService>(ProfileService);
  });

  describe('UsersService - definition', () => {
    it('UsersService - should be defined', () => {
      expect(usersService).toBeDefined();
    });
    it('User - should be defined', () => {
      expect(model).toBeDefined();
    });
    it('RolesService - should be defined', () => {
      expect(rolesService).toBeDefined();
    });
    it('FollowersService - should be defined', () => {
      expect(followersService).toBeDefined();
    });
    it('ProfileService - should be defined', () => {
      expect(profileService).toBeDefined();
    });
  });

  describe('UsersService - createUser', () => {
    it('should be successful result', async () => {
      const dto: CreateUserDTO = { email: 'email', password: 'password' };
      const mockRole: Partial<Role> = { id: 1, value: 'user' };
      const mockUser: Partial<User> = { $set: jest.fn(() => Promise.resolve(null)), id: 1, roles: [] };
      // @ts-ignore
      jest.spyOn(rolesService, 'getRoleByValue').mockImplementation(() => {
        return Promise.resolve(mockRole);
      });
      jest.spyOn(model, 'create').mockImplementation(() => {
        return Promise.resolve(mockUser);
      });
      const result = await usersService.createUser(dto);

      expect(result).toEqual({ ...mockUser, roles: [mockRole] });
      expect(rolesService.getRoleByValue).toBeCalledTimes(1);
      expect(rolesService.getRoleByValue).toBeCalledWith('user');
      expect(model.create).toBeCalledTimes(1);
      expect(model.create).toBeCalledWith(dto);
      expect(mockUser.$set).toBeCalledTimes(1);
      expect(mockUser.$set).toBeCalledWith('roles', [mockRole.id]);
    });
    it('should throw exception (roles configuration was missing)', async () => {
      const dto: CreateUserDTO = { email: 'email', password: 'password' };
      jest.spyOn(rolesService, 'getRoleByValue').mockImplementation(() => null);
      try {
        await usersService.createUser(dto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe(`${ErrorMessages.ru.SERVICE_IS_UNAVAILABLE}: ${ErrorMessages.ru.USER_ROLE_CONFIGURATION_IS_MISSING.toLowerCase()}`);
        expect(rolesService.getRoleByValue).toBeCalledTimes(1);
        expect(rolesService.getRoleByValue).toBeCalledWith('user');
        expect(model.create).toBeCalledTimes(0);
      }
    });
    it('should throw exception (user creation error)', async () => {
      const dto: CreateUserDTO = { email: 'email', password: 'password' };
      const mockRole: Partial<Role> = { id: 1, value: 'user' };
      const mockUser: Partial<User> = { $set: jest.fn(() => Promise.resolve(null)), id: 1, roles: [] };
      const errorMessage = 'errorMessage';
      // @ts-ignore
      jest.spyOn(rolesService, 'getRoleByValue').mockImplementation(() => {
        return Promise.resolve(mockRole);
      });
      jest.spyOn(model, 'create').mockImplementation(() => {
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      });
      try {
        await usersService.createUser(dto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`${ErrorMessages.ru.FAILED_TO_CREATE_USER}. ${errorMessage}`);
        expect(rolesService.getRoleByValue).toBeCalledTimes(1);
        expect(rolesService.getRoleByValue).toBeCalledWith('user');
        expect(model.create).toBeCalledTimes(1);
        expect(model.create).toBeCalledWith(dto);
        expect(mockUser.$set).toBeCalledTimes(0);
      }
    });
  });

  describe('UsersService - getUsers', () => {
    it('should be successful result', async () => {
      const users = mockUsers(10);
      const page = 1;
      const count = 10;
      const userId = users[0].id;
      // @ts-ignore
      jest.spyOn(model, 'findAll').mockImplementation(() => {
        return Promise.resolve(users);
      });
      jest.spyOn(model, 'count').mockImplementation(() => {
        return Promise.resolve(users.length);
      });
      const mockFollowRows: Partial<Followers>[] = [{ followerId: userId, userId: users[1].id }];
      // @ts-ignore
      jest.spyOn(followersService, 'findFollowRows').mockImplementation(() => {
        return Promise.resolve(mockFollowRows);
      });
      // @ts-ignore
      jest.spyOn(profileService, 'getUserProfile').mockImplementation((userId: number) => {
        return Promise.resolve({ photos: { small: `small${userId}`, large: `large${userId}` } })
      });
      const result = await usersService.getUsers(page, count, userId);

      expect(result.totalCount).toBe(users.length);
      expect(model.findAll).toBeCalledTimes(1);
      expect(model.findAll).toBeCalledWith({ offset:(page - 1) * count, limit: count });
      expect(model.count).toBeCalledTimes(1);
      expect(followersService.findFollowRows).toBeCalledTimes(1);
      expect(followersService.findFollowRows).toBeCalledWith(userId, users.map( user => user.id ));
      expect(profileService.getUserProfile).toBeCalledTimes(users.length);
      expect(profileService.getUserProfile).toBeCalledWith(users[0].id);
      expect(profileService.getUserProfile).toBeCalledWith(users[users.length - 1].id);
    })
  });

  describe('UsersService - getUserByEmail', () => {
    it('should be successful result', async () => {
      const user = mockUsers(1)[0];
      const email = user.email;
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation((options: FindOptions) => {
        return Promise.resolve(options.where['email'] === user.email ? user : null);
      })
      const result = await usersService.getUserByEmail(email);
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ where: { email } });
      expect(result).toEqual(user);
    });
    it('should be successful result (search with all user data)', async () => {
      const user = mockUsers(1)[0];
      const email = user.email;
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation((options: FindOptions) => {
        return Promise.resolve(options.where['email'] === user.email ? user : null);
      })
      const result = await usersService.getUserByEmail(email, true);
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ where: { email }, include: { all: true }});
      expect(result).toEqual(user);
    });
  });

  describe('UsersService - getUserById', () => {
    it('should be successful result (search with all user data)', async () => {
      const user = mockUsers(1)[0];
      const userId = user.id;
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation((options: FindOptions) => {
        return Promise.resolve(options.where['id'] === user.id ? user : null);
      })
      const result = await usersService.getUserById(userId);
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ where: { id: userId }, include: { all: true }});
      expect(result).toEqual(user);
    });
  });

  describe('UsersService - addRole', () => {
    it('should be successful result (search with all user data)', async () => {
      const roleValue = 'admin';
      const user = { ...mockUsers(1)[0], $add: jest.fn((field, roleId) => {
        if(field === 'roles') { // @ts-ignore
          user.roles = [{ id: roleId, value: roleValue }];
        }
      }) };
      const userId = user.id;
      const roleId = 1;
      const dto: AddUserRoleDTO = { userId, value: roleValue }
      // @ts-ignore
      jest.spyOn(model, 'findByPk').mockImplementation((id: number, _) => {
        return Promise.resolve(id === user.id ? user : null);
      })
      // @ts-ignore
      jest.spyOn(rolesService, 'getRoleByValue').mockImplementation((value: string) => {
        return Promise.resolve(value === dto.value ? { id: roleId, value } : null);
      })
      const result = await usersService.addRole(dto);

      expect(model.findByPk).toBeCalledTimes(1);
      expect(model.findByPk).toBeCalledWith(userId, { include: { all: true }});
      expect(rolesService.getRoleByValue).toBeCalledTimes(1);
      expect(rolesService.getRoleByValue).toBeCalledWith(dto.value);
      expect(result.roles.some(r => r.id === roleId)).toBeTruthy();
      expect(user.$add).toBeCalledTimes(1);
      expect(user.$add).toBeCalledWith('roles', roleId);
    });
    it('should throw exception (user already has the role)', async () => {
      const roleValue = 'admin';
      const user = { ...mockUsers(1)[0], roles: [{ id: 1, value: roleValue }], $add: jest.fn() };
      const userId = user.id;
      const dto: AddUserRoleDTO = { userId, value: roleValue }
      // @ts-ignore
      jest.spyOn(model, 'findByPk').mockImplementation((id: number, _) => {
        return Promise.resolve(id === user.id ? user : null);
      })

      try {
        await usersService.addRole(dto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_ACCEPTABLE);
        expect(error.message).toBe(`Пользователь уже имеет роль ${dto.value}`);
        expect(model.findByPk).toBeCalledTimes(1);
        expect(model.findByPk).toBeCalledWith(userId, { include: { all: true }});
        expect(rolesService.getRoleByValue).toBeCalledTimes(0);
        expect(user.$add).toBeCalledTimes(0);
      }
    });
    it('should throw exception (user was not found)', async () => {
      const roleValue = 'admin';
      const user = { ...mockUsers(1)[0], roles: [{ id: 1, value: roleValue }], $add: jest.fn() };
      const userId = user.id + 1;
      const dto: AddUserRoleDTO = { userId, value: roleValue }
      // @ts-ignore
      jest.spyOn(model, 'findByPk').mockImplementation((id: number, _) => {
        return Promise.resolve(id === user.id ? user : null);
      })

      try {
        await usersService.addRole(dto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe(ErrorMessages.ru.FAILED_TO_FIND_USER);
        expect(model.findByPk).toBeCalledTimes(1);
        expect(model.findByPk).toBeCalledWith(userId, { include: { all: true }});
        expect(rolesService.getRoleByValue).toBeCalledTimes(0);
        expect(user.$add).toBeCalledTimes(0);
      }
    });
    it('should throw exception (role was not found)', async () => {
      const roleValue = 'admin';
      const user = { ...mockUsers(1)[0], $add: jest.fn() };
      const userId = user.id;
      const dto: AddUserRoleDTO = { userId, value: roleValue }
      // @ts-ignore
      jest.spyOn(model, 'findByPk').mockImplementation((id: number, _) => {
        return Promise.resolve(id === user.id ? user : null);
      })
      // @ts-ignore
      jest.spyOn(rolesService, 'getRoleByValue').mockImplementation(() => {
        return Promise.resolve(null);
      })

      try {
        await usersService.addRole(dto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe(ErrorMessages.ru.FAILED_TO_FIND_ROLE);
        expect(model.findByPk).toBeCalledTimes(1);
        expect(model.findByPk).toBeCalledWith(userId, { include: { all: true }});
        expect(rolesService.getRoleByValue).toBeCalledTimes(1);
        expect(rolesService.getRoleByValue).toBeCalledWith(dto.value);
        expect(user.$add).toBeCalledTimes(0);
      }
    });
  });

  describe('UsersService - ban', () => {
    it('should be successful result', async () => {
      const user = { ...mockUsers(1)[0], save: jest.fn(), banned: false, banReason: '' };
      const userId = user.id;
      const dto: BanUserDTO = { userId, banReason: 'banReason' };
      // @ts-ignore
      jest.spyOn(model, 'findByPk').mockImplementation((id: number) => {
        return Promise.resolve(id === user.id ? user : null);
      });
      const result = await usersService.ban(dto);

      expect(result.id).toBe(userId);
      expect(result.banned).toBeTruthy();
      expect(result.banReason).toBe(dto.banReason);
      expect(model.findByPk).toBeCalledTimes(1);
      expect(model.findByPk).toBeCalledWith(dto.userId);
      expect(user.save).toBeCalledTimes(1);
    });
    it('should throw exception (user was not found)', async () => {
      const user = { ...mockUsers(1)[0], save: jest.fn(), banned: false, banReason: '' };
      const userId = user.id + 1;
      const dto: BanUserDTO = { userId, banReason: 'banReason' };
      // @ts-ignore
      jest.spyOn(model, 'findByPk').mockImplementation((id: number) => {
        return Promise.resolve(id === user.id ? user : null);
      });
      try {
        await usersService.ban(dto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe(ErrorMessages.ru.FAILED_TO_FIND_USER);
        expect(model.findByPk).toBeCalledTimes(1);
        expect(model.findByPk).toBeCalledWith(dto.userId);
        expect(user.save).toBeCalledTimes(0);
      }
    });
  });

  describe('UsersService - getStatus', () => {
    it('should be successful result', async () => {
      const userId = 1;
      const status = 'status';
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        return Promise.resolve({ status })
      });
      const result = await usersService.getStatus(userId);
      expect(result.status).toBe(status);
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ attributes: ["status"], where: { id: userId } });
    });
    it('should throw exception (user was not found)', async () => {
      const userId = 1;
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        return Promise.resolve(null)
      });
      try {
        await usersService.getStatus(userId);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(model.findOne).toBeCalledTimes(1);
        expect(model.findOne).toBeCalledWith({ attributes: ["status"], where: { id: userId } });
      }
    });
  });

  describe('UsersService - setStatus', () => {
    it('should be successful result', async () => {
      const user = mockUsers(1)[0];
      const userId = user.id;
      const status = 'new status';
      const updatedRowsCount = 1;
      const dto: SetUserStatusDTO = { status };
      // @ts-ignore
      jest.spyOn(model, 'update').mockImplementation((values: { status }, options: UpdateOptions) => {
        if (options.where['id'] === userId) {
          user.status = values.status;
          return [updatedRowsCount, [user]];
        } else return null;
      });
      const result = await usersService.setStatus(dto, userId);
      expect(result[0]).toBe(updatedRowsCount);
      expect(result[1][0].id).toBe(userId);
      expect(result[1][0].status).toBe(status);
      expect(model.update).toBeCalledTimes(1);
      expect(model.update).toBeCalledWith({ status: dto.status }, { where: { id: userId } });
    });
  });
});