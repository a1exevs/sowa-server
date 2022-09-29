import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/sequelize";
import { RolesService } from "./roles.service";
import { Role } from "./roles.model";
import { CreateRoleRequest } from "./dto/create-role.request";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorMessages } from "../common/constants/error-messages";

describe('RolesService', () => {
  let rolesService: RolesService;
  let model: typeof Role;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(Role),
          useValue: {
            create: jest.fn(x => x),
            findOne: jest.fn(x => x)
          }
        }
      ],
    }).compile();
    rolesService = module.get<RolesService>(RolesService);
    model = module.get<typeof Role>(getModelToken(Role));
  });

  describe('RolesService - definition', () => {
    it('RolesService - should be defined', () => {
      expect(rolesService).toBeDefined();
    });
    it('Role - should be defined', () => {
      expect(model).toBeDefined();
    });
  });

  describe('RolesService - createRole', () => {
    it('should be successful result', async () => {
      const dto: CreateRoleRequest.Dto = { value: 'admin', description: 'Admin role' };
      const mockCreatedRole: Partial<Role> = { id: 1, ...dto };
      jest.spyOn(model, 'create').mockImplementation(() => {
        return Promise.resolve(mockCreatedRole);
      });
      const result = await rolesService.createRole(dto);

      expect(result).toEqual(mockCreatedRole);
      expect(model.create).toBeCalledTimes(1);
      expect(model.create).toBeCalledWith(dto);
    });
    it('should throw exception (error creation role)', async () => {
      const dto: CreateRoleRequest.Dto = { value: 'admin', description: 'Admin role' };
      const errorMessage = 'Duplicate';
      jest.spyOn(model, 'create').mockImplementation(() => {
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      });

      try {
        await rolesService.createRole(dto);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(`${ErrorMessages.ru.FAILED_TO_CREATE_ROLE}. ${errorMessage}`);
        expect(model.create).toBeCalledTimes(1);
        expect(model.create).toBeCalledWith(dto);
      }
    });
  });

  describe('RolesService - getRoleByValue', () => {
    it('should be successful result', async () => {
      const request = 'admin';
      const mockServiceResponse: Partial<Role> = { id: 1, value: request, description: 'Admin role' }
      // @ts-ignore
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        return Promise.resolve(mockServiceResponse)
      })
      const result = await rolesService.getRoleByValue(request);

      expect(result).toEqual(mockServiceResponse);
      expect(model.findOne).toBeCalledTimes(1);
      expect(model.findOne).toBeCalledWith({ where: { value: request } });
    });
  });
});