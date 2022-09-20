import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from './auth.service';
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { createResponse, createRequest } from "node-mocks-http";
import { AuthenticationResponse } from "./DTO/AuthenticationResponse";
import { UsersService } from "../users/users.service";
import { TokensService } from "./tokens.service";
import { AuthenticationResDto } from "./DTO/AuthenticationResDto";
import { ValidationPipe } from "../common/pipes/validation.pipe";
import { ArgumentMetadata, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./DTO/RegisterDto";
import { LoginDto } from "./DTO/LoginDto";
import { UnauthorizedExceptionFilter } from "./exceptionfilters/unauthorizedexceptionfilter";
import { SvgCaptchaGuard } from "./guards/svgcaptcha.guard";
import { GetCurrentUserResponse } from "./DTO/get-current-user.response";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { HttpExceptionFilter } from "../common/exceptions/filters/httpexceptionfilter";
import { ResponseInterceptor } from "../common/interceptors/ResponseInterceptor";
import { sendPseudoError } from "../../test-helpers/tests-helper.spec";
import { ErrorMessages } from "../common/constants/error-messages";
import './../../string.extensions'

const getValidationPipeDataForUserRegistration  = function(email, password) {
  let target: ValidationPipe = new ValidationPipe();
  const registerDto: RegisterDto = { email, password};
  const metadata: ArgumentMetadata = { type: 'body', metatype: RegisterDto };
  return {target, metadata, registerDto};
}

const getMockAuthenticationResponse = function(userId, accessToken, refreshToken): AuthenticationResponse {
  return {
    status: 'success',
    data: {
      user: {
        id: userId
      },
      payload: {
        type: 'bearer',
        access_token: accessToken,
        refresh_token: refreshToken,
        refresh_token_expiration: new Date()
      }
    }
  };
}

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let unauthorizedExceptionFilter: UnauthorizedExceptionFilter;
  let httpExceptionFilter: HttpExceptionFilter;
  let jwtAuthGuard: JwtAuthGuard;
  let refreshTokenGuard: RefreshTokenGuard;
  let svgCaptchaGuard: SvgCaptchaGuard;
  let responseInterceptor: ResponseInterceptor<any>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    const userService = { provide: UsersService, useValue: {} };
    const jwtService = { provide: JwtService, useValue: {} };
    const tokenService = { provide: TokensService, useValue: {} }

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registration: jest.fn(x => x),
            login: jest.fn(x => x),
            refresh: jest.fn(x => x),
            me: jest.fn(x => x),
            logout: jest.fn(x => x)
          }
        },
        userService,
        jwtService,
        tokenService
      ]
    }).compile();
    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    unauthorizedExceptionFilter = moduleRef.get<UnauthorizedExceptionFilter>(UnauthorizedExceptionFilter);
    httpExceptionFilter = moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);
    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    refreshTokenGuard = moduleRef.get<RefreshTokenGuard>(RefreshTokenGuard);
    svgCaptchaGuard = moduleRef.get<SvgCaptchaGuard>(SvgCaptchaGuard);
    responseInterceptor = moduleRef.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  describe('AuthController - definition', () => {
    it('AuthController - should be defined', () => {
      expect(authController).toBeDefined();
    });
    it('AuthService - should be defined', () => {
      expect(authService).toBeDefined();
    });
    it('UnauthorizedExceptionFilter - should be defined', () => {
      expect(unauthorizedExceptionFilter).toBeDefined();
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
    it('SvgCaptchaGuard - should be defined', () => {
      expect(svgCaptchaGuard).toBeDefined();
    });
    it('ResponseInterceptor - should be defined', () => {
      expect(responseInterceptor).toBeDefined();
    });
  });

  describe('AuthController - registration', () => {
    it('Input params validation: should return bad request (incorrect email)', async () => {
      const {target, metadata, registerDto} =
        getValidationPipeDataForUserRegistration('useryandex.ru', '12345678');
      try {
        await target.transform(registerDto, metadata);
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.getResponse()).toContainEqual(`email - ${ErrorMessages.ru.MUST_HAS_EMAIL_FORMAT}`);
      }
    });
    it('Input params validation: should return bad request (incorrect small password)', async () => {
      const {target, metadata, registerDto} =
        getValidationPipeDataForUserRegistration('useryandex.ru', '1234567')
      try {
        await target.transform(registerDto, metadata);
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.getResponse()).toContainEqual(`password - ${ErrorMessages.ru.STRING_LENGTH_MUST_NOT_BE_LESS_THAN_M_AND_GREATER_THAN_N.format(8, 50)}`);
      }
    });
    it('Input params validation: should return bad request (incorrect large password)', async () => {
      const {target, metadata, registerDto} =
        getValidationPipeDataForUserRegistration(
        'useryandex.ru',
        '123456789012345678901234567890123456789012345678901'
      )
      try {
        await target.transform(registerDto, metadata);
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.getResponse()).toContainEqual(`password - ${ErrorMessages.ru.STRING_LENGTH_MUST_NOT_BE_LESS_THAN_M_AND_GREATER_THAN_N.format(8, 50)}`);
      }
    });
    it('Input params validation: should be successful', async () => {
      const {target, metadata, registerDto} =
        getValidationPipeDataForUserRegistration('user@yandex.ru', '12345678')
      try {
        await target.transform(registerDto, metadata);
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(0);
        expect(err.getResponse()).toBe("Don't throw");
      }
    });
    it('Registration method: should be successful result', async () => {
      const res = createResponse();
      const userId = 1;
      const accessToken = '12345fsagasdsfasdfsdf';
      const refreshToken = '12345fsagasdsdfsdf';
      const serviceRegisterResponseMock =
        getMockAuthenticationResponse(userId, accessToken, refreshToken);
      const registerDto = { email: "user@yandex.ru", password: '12345678' };
      const mockRegistrationF = jest.spyOn(authService, 'registration').mockImplementation(async () => serviceRegisterResponseMock);
      const controllerRegisterResponse = new AuthenticationResDto(userId, accessToken);
      const response = await authController.registration(registerDto, res);
      expect(response).toEqual(controllerRegisterResponse);
      expect(res.cookies.refresh_token.value).toBe(refreshToken);
      expect(res.cookies.refresh_token.options.httpOnly).toBe(true);
      expect(mockRegistrationF).toBeCalledTimes(1);
      expect(mockRegistrationF).toBeCalledWith(registerDto);
    });
    it('Registration method: should return bad request (user already exists)', async () => {
      const res = createResponse();
      const exceptionMessage = ErrorMessages.ru.USER_ALREADY_EXISTS;
      const registerDto = { email: "user@yandex.ru", password: '12345678' };
      jest.spyOn(authService, 'registration').mockImplementation(async () => {
        throw new HttpException(exceptionMessage, HttpStatus.BAD_REQUEST);
      });
      try {
        await authController.registration(registerDto, res);
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(400);
        expect(authService.registration).toBeCalledTimes(1);
        expect(err.getResponse()).toBe(exceptionMessage);
      }
    });
  });

  describe('AuthController - login', () => {
    it('Login method: should be successful result', async () => {
      const req = createRequest();
      req._setSessionVariable('authFailedCount', '5')
      const res = createResponse();
      const userId = 1;
      const accessToken = '12345fsagasdsfasdfsdf';
      const refreshToken = '12345fsagasdsdfsdf';
      const serviceLoginResponseMock =
        getMockAuthenticationResponse(userId, accessToken, refreshToken);
      const loginDto: LoginDto = { email: "user@yandex.ru", password: '0000' };
      const mockLoginF = jest.spyOn(authService, 'login').mockImplementation(async () => Promise.resolve(serviceLoginResponseMock));
      const controllerLoginResponse = new AuthenticationResDto(userId, accessToken);
      const response = await authController.login(loginDto, res, req);
      expect(response).toEqual(controllerLoginResponse);
      expect(res.cookies.refresh_token.value).toBe(refreshToken);
      expect(res.cookies.refresh_token.options.httpOnly).toBe(true);
      expect(req.session['authFailedCount']).toBeNull();
      expect(mockLoginF).toBeCalledTimes(1);
      expect(mockLoginF).toBeCalledWith(loginDto);
    });
    it('Login method: should be unauthorized', async () => {
      const req = createRequest();
      const authFailedCount = '5';
      req._setSessionVariable('authFailedCount', authFailedCount);
      const res = createResponse();
      const loginDto = { email: "user@yandex.ru", password: '12345678' };
      const exceptionMessage = ErrorMessages.ru.INVALID_EMAIL_OR_PASSWORD;
      const errorObject = {message: exceptionMessage};
      jest.spyOn(authService, 'login').mockImplementation(async () => {
        throw new UnauthorizedException(errorObject);
      });

      try {
        await authController.login(loginDto, res, req);
        sendPseudoError();
      } catch(err) {
        expect(err.status).toBe(401);
        expect(res.cookies.refresh_token).toBeUndefined();
        expect(req.session['authFailedCount']).toBe(authFailedCount);
        expect(err.getResponse()).toMatchObject(errorObject);
        expect(authService.login).toBeCalledTimes(1);
      }
    });
  });

  describe('AuthController - refresh', () => {
    it('Refresh method: should be successful result', async () => {
      const userId = 1;
      const accessToken = '12345fsagasdsfasdfsdf';
      const oldRefreshToken = '54321fsagasdsdfsdf';
      const newRefreshToken = '12345fsagasdsdfsdf';
      const req = createRequest();
      req._setCookiesVariable('refresh_token', oldRefreshToken);
      const res = createResponse();
      const mockAuthenticationResponse =
        getMockAuthenticationResponse(userId, accessToken, newRefreshToken);
      const mockRefreshF = jest.spyOn(authService, 'refresh').mockImplementation(async () => Promise.resolve(mockAuthenticationResponse));
      const controllerLoginResponse = new AuthenticationResDto(userId, accessToken);
      const response = await authController.refresh(req, res);
      expect(response).toEqual(controllerLoginResponse);
      expect(res.cookies.refresh_token.value).toBe(newRefreshToken);
      expect(res.cookies.refresh_token.options.httpOnly).toBe(true);
      expect(mockRefreshF).toBeCalledTimes(1);
      expect(mockRefreshF).toBeCalledWith(oldRefreshToken);
    });
  });

  describe('AuthController - me', () => {
    it('Get current user method: should be successful result', async () => {
      const userId = 1;
      const req = {
        user: {
          id: userId
        }
      };

      const mockGetCurrentUserResponseUser: GetCurrentUserResponse.User = {
        id: userId,
        email: 'user@yandex.ru'
      }
      const mockMeF = jest.spyOn(authService, 'me').mockImplementation(async () => Promise.resolve(mockGetCurrentUserResponseUser));

      const response = await authController.me(req);
      expect(response).toEqual(mockGetCurrentUserResponseUser);
      expect(mockMeF).toBeCalledTimes(1);
      expect(mockMeF).toBeCalledWith(userId);
    });
  });

  describe('AuthController - logout', () => {
    it('Logout method: should be successful result', async () => {
      const refreshToken = '12345fsagasdsdfsdf';
      const req = createRequest();
      const res = createResponse();
      req._setCookiesVariable('refresh_token', refreshToken);
      const mockServiceLogoutResponse = false;
      const mockLogoutF = jest.spyOn(authService, 'logout').mockImplementation(async () => Promise.resolve(mockServiceLogoutResponse));

      const response = await authController.logout(req, res);

      expect(response.result).toEqual(mockServiceLogoutResponse);
      expect(res.cookies.refresh_token.value).toBe("");
      expect(mockLogoutF).toBeCalledTimes(1);
      expect(mockLogoutF).toBeCalledWith(refreshToken);
    });
  });
});
