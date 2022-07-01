import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { TokensService } from "./tokens.service";
import { LoginDto } from "./DTO/LoginDto";
import * as bcrypt from "bcryptjs";
import { sendPseudoError } from "../../test-helpers/tests-helper.spec";
import { RegisterDto } from "./DTO/RegisterDto";
import { UnprocessableEntityException } from "@nestjs/common";

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;
  let tokenService: TokensService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(x => x),
            getUserById: jest.fn(x => x),
            createUser: jest.fn(x => x),
          }
        },
        {
          provide: JwtService,
          useValue: {}
        },
        {
          provide: TokensService,
          useValue: {
            generateAccessToken: jest.fn(x => x),
            generateRefreshToken: jest.fn(x => x),
            getRefreshTokenExpiration: jest.fn(x => x),
            updateAccessRefreshTokensFromRefreshToken: jest.fn(x => x),
            removeRefreshToken: jest.fn(x => x),
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    tokenService = module.get<TokensService>(TokensService);
  });

  describe('AuthService - definition', () => {
    it('AuthService - should be defined', () => {
      expect(authService).toBeDefined();
    });
    it('UsersService - should be defined', () => {
      expect(userService).toBeDefined();
    });
    it('JwtService - should be defined', () => {
      expect(jwtService).toBeDefined();
    });
    it('TokensService - should be defined', () => {
      expect(tokenService).toBeDefined();
    });
  });

  describe('AuthService - registration', () => {
    it('Registration method: should be successful result', async () => {
      const email = 'user@yandex.com';
      const password = '1234';
      const hashedPassword = await bcrypt.hash(password, 5);
      const accessToken = 'asdfsdfsdf';
      const refreshToken = 'asdfsdfsdf';

      const registerDto: RegisterDto = { email, password };
      const mockCreatedUser = {
        email,
        password: hashedPassword
      };

      // @ts-ignore
      jest.spyOn(userService, 'createUser').mockImplementation(async () => {
        return Promise.resolve(mockCreatedUser);
      });
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => {
        return Promise.resolve(undefined);
      });
      jest.spyOn(tokenService, 'generateAccessToken').mockImplementation(async () => {
        return Promise.resolve(accessToken);
      });
      jest.spyOn(tokenService, 'generateRefreshToken').mockImplementation(async () => {
        return Promise.resolve(refreshToken);
      });
      jest.spyOn(tokenService, 'getRefreshTokenExpiration').mockImplementation( () => {
        const expiration = new Date()
        expiration.setTime(expiration.getTime() + TokensService.getRefreshTokenExpiresIn())
        return expiration;
      });
      const spyHashF = jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return hashedPassword;
      });

      const result = await authService.registration(registerDto);

      expect(result.status).toBe('success');
      expect(result.data.payload.access_token).toBe(accessToken);
      expect(result.data.payload.refresh_token).toBe(refreshToken);
      expect(result.data.payload.type).toBe('bearer')
      expect(userService.getUserByEmail).toBeCalledTimes(1);
      expect(userService.getUserByEmail).toBeCalledWith(email);
      expect(userService.createUser).toBeCalledTimes(1);
      expect(userService.createUser).toBeCalledWith({ ...registerDto, password: hashedPassword });
      expect(spyHashF).toBeCalledTimes(1);
      expect(spyHashF).toBeCalledWith(password, 5);
      expect(tokenService.generateAccessToken).toBeCalledTimes(1);
      expect(tokenService.generateAccessToken).toBeCalledWith(mockCreatedUser);
      expect(tokenService.generateRefreshToken).toBeCalledTimes(1);
      expect(tokenService.generateRefreshToken).toBeCalledWith(mockCreatedUser, TokensService.getRefreshTokenExpiresIn());
      spyHashF.mockRestore();
    });
    it('Registration method: should throw Bad Request exception (user already exists)', async () => {
      const email = 'user@yandex.com';
      const password = '1234';
      const hashedPassword = await bcrypt.hash(password, 5);

      const registerDto: RegisterDto = { email, password };
      const mockCreatedUser = {
        email,
        password: hashedPassword
      };

      // @ts-ignore
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => {
        return Promise.resolve(mockCreatedUser);
      });
      const spyHashF = jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return hashedPassword;
      });

      try {
        await authService.registration(registerDto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(400);
        expect(userService.getUserByEmail).toBeCalledTimes(1);
        expect(userService.getUserByEmail).toBeCalledWith(email);
        expect(userService.createUser).toBeCalledTimes(0);
        expect(spyHashF).toBeCalledTimes(0);
        expect(tokenService.generateAccessToken).toBeCalledTimes(0);
        expect(tokenService.generateRefreshToken).toBeCalledTimes(0);
        spyHashF.mockRestore();
      }
    });
  });

  describe('AuthService - login', () => {
    it('Login method: should be successful result', async () => {
      const email = 'user@yandex.com';
      const password = '1234';
      const hashedPassword = await bcrypt.hash(password, 5);
      const accessToken = 'asdfsdfsdf';
      const refreshToken = 'asdfsdfsdf';

      const loginDto: LoginDto = { email, password };
      const mockUser = {
        email,
        password: hashedPassword
      };

      // @ts-ignore
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => {
        return Promise.resolve(mockUser);
      });
      jest.spyOn(tokenService, 'generateAccessToken').mockImplementation(async () => {
        return Promise.resolve(accessToken);
      });
      jest.spyOn(tokenService, 'generateRefreshToken').mockImplementation(async () => {
        return Promise.resolve(refreshToken);
      });
      jest.spyOn(tokenService, 'getRefreshTokenExpiration').mockImplementation( () => {
        const expiration = new Date()
        expiration.setTime(expiration.getTime() + TokensService.getRefreshTokenExpiresIn())
        return expiration;
      });

      const result = await authService.login(loginDto);

      expect(result.status).toBe('success');
      expect(result.data.payload.access_token).toBe(accessToken);
      expect(result.data.payload.refresh_token).toBe(refreshToken);
      expect(result.data.payload.type).toBe('bearer')
      expect(userService.getUserByEmail).toBeCalledTimes(1);
      expect(userService.getUserByEmail).toBeCalledWith(email, true);
      expect(tokenService.generateAccessToken).toBeCalledTimes(1);
      expect(tokenService.generateAccessToken).toBeCalledWith(mockUser);
      expect(tokenService.generateRefreshToken).toBeCalledTimes(1);
      expect(tokenService.generateRefreshToken).toBeCalledWith(mockUser, TokensService.getRefreshTokenExpiresIn());
    });
    it('Login method: should be unauthorized (user with email not found)', async () => {
      const email = 'user@yandex.com';
      const password = '1234';

      const loginDto: LoginDto = { email, password };

      // @ts-ignore
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => {
        return Promise.resolve(undefined);
      });

      try {
        await authService.login(loginDto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.getResponse()).toMatchObject({ message: 'Неверный email или пароль' });
        expect(userService.getUserByEmail).toBeCalledTimes(1);
        expect(userService.getUserByEmail).toBeCalledWith(email, true);
        expect(tokenService.generateAccessToken).toBeCalledTimes(0);
        expect(tokenService.generateRefreshToken).toBeCalledTimes(0);
      }
    });
    it('Login method: should be unauthorized (password is incorrect)', async () => {
      const email = 'user@yandex.com';
      const password = '1234';
      const hashedPassword = await bcrypt.hash(password, 5);
      const incorrectPassword = password + 'sadf';

      const loginDto: LoginDto = { email, password: incorrectPassword };
      const mockUser = {
        email,
        password: hashedPassword
      };

      // @ts-ignore
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async () => {
        return Promise.resolve(mockUser);
      });

      try {
        await authService.login(loginDto);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.getResponse()).toMatchObject({ message: 'Неверный email или пароль' });
        expect(userService.getUserByEmail).toBeCalledTimes(1);
        expect(userService.getUserByEmail).toBeCalledWith(email, true);
        expect(tokenService.generateAccessToken).toBeCalledTimes(0);
        expect(tokenService.generateRefreshToken).toBeCalledTimes(0);
      }
    });
  });

  describe('AuthService - refresh', () => {
    it('Refresh method: should be successful result', async () => {
      const currentRefreshToken = 'adfsdfsadfsdf';
      const newRefreshToken = '12134214234123';
      const newAccessToken = 'sdfsdfsdfsdfsdfsdfsdf';
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'user@yandex.ru',
        password: 'asdfsafas'
      };
      // @ts-ignore
      jest.spyOn(tokenService, 'updateAccessRefreshTokensFromRefreshToken').mockImplementation(async () => {
        return Promise.resolve({ refresh_token: newRefreshToken, access_token: newAccessToken, user: mockUser });
      });

      const result = await authService.refresh(currentRefreshToken);

      expect(result.status).toBe('success');
      expect(result.data.user.id).toBe(userId);
      expect(result.data.payload.type).toBe('bearer');
      expect(result.data.payload.refresh_token).toBe(newRefreshToken);
      expect(result.data.payload.access_token).toBe(newAccessToken);
      expect(tokenService.updateAccessRefreshTokensFromRefreshToken).toBeCalledTimes(1);
      expect(tokenService.updateAccessRefreshTokensFromRefreshToken).toBeCalledWith(currentRefreshToken);
    });
    it('Refresh method: should throw exception (token not found)', async () => {
      const currentRefreshToken = 'adfsdfsadfsdf';
      jest.spyOn(tokenService, 'updateAccessRefreshTokensFromRefreshToken').mockImplementation(async () => {
        throw new UnprocessableEntityException('Refresh token not found');
      });

      try {
        await authService.refresh(currentRefreshToken);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(422);
        expect(error.getResponse()).toMatchObject({ message: 'Refresh token not found' });
        expect(tokenService.updateAccessRefreshTokensFromRefreshToken).toBeCalledTimes(1);
        expect(tokenService.updateAccessRefreshTokensFromRefreshToken).toBeCalledWith(currentRefreshToken);
      }
    });
  });

  describe('AuthService - me', () => {
    it('Me method: should be successful result', async () => {
      const userId = 1;
      const userEmail = 'user@yandex.ru';
      const mockUser = {
        id: userId,
        email: userEmail,
        password: 'asdfsafas'
      };
      // @ts-ignore
      jest.spyOn(userService, 'getUserById').mockImplementation(async () => {
        return Promise.resolve(mockUser);
      })
      const result = await authService.me(userId);
      expect(result.id).toBe(userId);
      expect(result.email).toBe(userEmail);
      expect(userService.getUserById).toBeCalledTimes(1);
      expect(userService.getUserById).toBeCalledWith(userId);
    });
    it('Me method: should be unauthorized (user not found', async () => {
      const userId = 1;
      // @ts-ignore
      jest.spyOn(userService, 'getUserById').mockImplementation(async () => {
        return Promise.resolve(undefined);
      })
      try {
        await authService.me(userId);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.getResponse()).toMatchObject({ message: 'Пользователь не авторизован' });
        expect(userService.getUserById).toBeCalledTimes(1);
        expect(userService.getUserById).toBeCalledWith(userId);
      }
    });
  });

  describe('AuthService - logout', () => {
    it('Logout method: should be successful result', async () => {
      const refreshToken = 'sdfsdfsdfsdf';
      const refreshTokenResult = true;
      jest.spyOn(tokenService, 'removeRefreshToken').mockImplementation(async () => {
        return Promise.resolve(refreshTokenResult);
      });
      const result = await authService.logout(refreshToken);

      expect(result).toBe(refreshTokenResult);
      expect(tokenService.removeRefreshToken).toBeCalledTimes(1);
      expect(tokenService.removeRefreshToken).toBeCalledWith(refreshToken);
    });
    it('Logout method: should be unsuccessful result', async () => {
      const refreshToken = 'sdfsdfsdafsdf';
      const refreshTokenResult = false;
      jest.spyOn(tokenService, 'removeRefreshToken').mockImplementation(async () => {
        return Promise.resolve(refreshTokenResult);
      });
      const result = await authService.logout(refreshToken);

      expect(result).toBe(refreshTokenResult);
      expect(tokenService.removeRefreshToken).toBeCalledTimes(1);
      expect(tokenService.removeRefreshToken).toBeCalledWith(refreshToken);
    });
    it('Logout method: should throw exception (token expired)', async () => {
      const refreshToken = 'sdfsdfsdafsdf';
      jest.spyOn(tokenService, 'removeRefreshToken').mockImplementation(async () => {
        throw new UnprocessableEntityException('Refresh token expired')
      });

      try {
        await authService.logout(refreshToken);
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(422);
        expect(error.getResponse()).toMatchObject({ message: 'Refresh token expired' });
        expect(tokenService.removeRefreshToken).toBeCalledTimes(1);
        expect(tokenService.removeRefreshToken).toBeCalledWith(refreshToken);
      }
    });
  });
});
