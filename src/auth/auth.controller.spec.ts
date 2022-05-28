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
import { ArgumentMetadata, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./DTO/RegisterDto";
import { LoginDto } from "./DTO/LoginDto";
import { UnauthorizedExceptionFilter } from "./exceptionfilters/unauthorizedexceptionfilter";
import { MAX_AUTH_FAILED_COUNT, SvgCaptchaGuard } from "./guards/svgcaptcha.guard";
import { ResultCodes } from "../common/constants/resultcodes";
import { GetCurrentUserResponse } from "./DTO/get-current-user.response";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { HttpExceptionFilter } from "../common/exceptions/filters/httpexceptionfilter";
import { ResponseInterceptor } from "../common/interceptors/ResponseInterceptor";
import { Request } from "express";
import { sendPseudoError } from "../../test/tests-helper.spec";

interface IGetMockRequest {
  sessionVariables?: Record<'key' | 'value', string>[],
  cookiesVariable?: Record<'key' | 'value', string>[],
  body?: any,
}
interface IGetMockExecutionContextData extends IGetMockRequest {
  req?: any
}
interface IGetMockArgumentsHost extends IGetMockExecutionContextData {}
interface IGetMockJWTServiceData {
  expiresIn: string,
  payload: string | object
  subject?: string
  jwtId?: string
}

const getMockJWTServiceData = function(props: IGetMockJWTServiceData) {
  const jwtService = new JwtService({
    secret: 'SECRET',
    signOptions: {
      expiresIn: props.expiresIn,
      subject: props.subject ?? '',
      jwtid: props.jwtId ?? ''
    }
  });
  const token = jwtService.sign(props.payload);
  return {
    token,
    jwtService
  };
}

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

const getMockRequest = function(props: IGetMockRequest): Request {
  const request = createRequest();
  if(props.sessionVariables && props.sessionVariables.length)
    props.sessionVariables.forEach( variable => request._setSessionVariable(variable.key, variable.value) )

  if(props.cookiesVariable && props.cookiesVariable.length)
    props.cookiesVariable.forEach( cookie => request._setCookiesVariable(cookie.key, cookie.value) )

  if(props.body)
    request._setBody(props.body);

  return request;
}

const getMockExecutionContextData = function(props: IGetMockExecutionContextData) {
  const {mockArgumentsHost, mockGetRequest, mockGetResponse, request, response} = getMockArgumentsHostData(props);
  const mockContext: ExecutionContext = {
    getClass: jest.fn(),
    getHandler: jest.fn(),
    ...mockArgumentsHost
  };

  return {
    mockContext,
    mockGetRequest,
    mockGetResponse,
    request,
    response
  };
}

const getMockArgumentsHostData = function(props: IGetMockArgumentsHost) {
  const request = props.req ? props.req : getMockRequest(props);
  const response = createResponse();
  const mockGetResponse = jest.fn().mockImplementation(() => response);
  const mockGetRequest = jest.fn().mockImplementation(() => request);
  const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest
  }));
  const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn()
  };
  return {
    mockArgumentsHost,
    mockGetRequest,
    mockGetResponse,
    request,
    response
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
        expect(err.getResponse()).toContainEqual('email - Некорректный email');
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
        expect(err.getResponse()).toContainEqual('password - Длина должна быть больше 8 и меньше 50 символов');
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
        expect(err.getResponse()).toContainEqual('password - Длина должна быть больше 8 и меньше 50 символов');
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
      const exceptionMessage = 'Пользователь уже существует';
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
      const exceptionMessage = 'Неверный email или пароль';
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
    it('Login mehtod: should be catch unauthorized exception by filter', async () => {
      const authFailedCount = '5';
      const {mockArgumentsHost, mockGetRequest, mockGetResponse, request, response} = getMockArgumentsHostData({
        sessionVariables: [
          {key: 'authFailedCount', value: authFailedCount}
        ]
      })

      const exceptionMessage = 'Неверный email или пароль';
      const errorObject = {message: exceptionMessage};

      unauthorizedExceptionFilter.catch(new UnauthorizedException(errorObject), mockArgumentsHost);
      const body = JSON.parse(response._getData());

      expect(response._getStatusCode()).toBe(401);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(request.session['authFailedCount']).toBe((+authFailedCount) + 1);
      expect(body.resultCode).toBe(ResultCodes.NEED_CAPTCHA_AUTHORIZATION);
    })
    it('Svg Captcha Guard: captcha text correct. Authorization failed MAX times', async () => {
      const authFailedCount = `${MAX_AUTH_FAILED_COUNT}`;
      const captchaText = '1234';
      const loginDto = { email: "user@yandex.ru", password: '12345678', captcha: captchaText};
      const {mockContext, mockGetRequest, mockGetResponse, request} = getMockExecutionContextData({
          sessionVariables: [
            {key: 'authFailedCount', value: authFailedCount},
            {key: 'captcha', value: captchaText}
          ],
          body: loginDto
        }
      );

      const captchaGuard = new SvgCaptchaGuard();
      const result = captchaGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(request.session['captcha']).toBeNull();
    })
    it('Svg Captcha Guard: captcha text correct. Authorization failed MAX+1 times', async () => {
      const authFailedCount = `${MAX_AUTH_FAILED_COUNT + 1}`;
      const captchaText = '1234';
      const loginDto = { email: "user@yandex.ru", password: '12345678', captcha: captchaText};
      const {mockContext, mockGetRequest, mockGetResponse, request} = getMockExecutionContextData({
          sessionVariables: [
            {key: 'authFailedCount', value: authFailedCount},
            {key: 'captcha', value: captchaText}
          ],
          body: loginDto
        }
      );

      const captchaGuard = new SvgCaptchaGuard();
      const result = captchaGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(request.session['captcha']).toBeNull();
    })
    it('Svg Captcha Guard: captcha text incorrect', async () => {
      const authFailedCount = `${MAX_AUTH_FAILED_COUNT}`;
      const correctCaptchaText = '1234';
      const incorrectCaptchaText = '1254';
      const loginDto = { email: "user@yandex.ru", password: '12345678', captcha: incorrectCaptchaText};
      const {mockContext, mockGetRequest, mockGetResponse, request, response} = getMockExecutionContextData({
          sessionVariables: [
            {key: 'authFailedCount', value: authFailedCount},
            {key: 'captcha', value: correctCaptchaText}
          ],
          body: loginDto
        }
      );

      const captchaGuard = new SvgCaptchaGuard();
      const result = captchaGuard.canActivate(mockContext);
      const data = JSON.parse(response._getData());

      expect(result).toBe(false);
      expect(response._getStatusCode()).toBe(401);
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(request.session['captcha']).toBeNull();
      expect(data.resultCode).toBe(ResultCodes.NEED_CAPTCHA_AUTHORIZATION);
      expect(data.messages).toContainEqual('Need authorization with captcha.');
      expect(data.data).toBeNull();
    })
    it('Svg Captcha Guard: captcha text correct. Authorization failed MAX-1 times', async () => {
      const authFailedCount = `${MAX_AUTH_FAILED_COUNT - 1}`;
      const loginDto = { email: "user@yandex.ru", password: '12345678'};
      const {mockContext, mockGetRequest, mockGetResponse, request} = getMockExecutionContextData({
          sessionVariables: [
            {key: 'authFailedCount', value: authFailedCount}
          ],
          body: loginDto
        }
      );

      const captchaGuard = new SvgCaptchaGuard();
      const result = captchaGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(request.session['captcha']).toBeNull();
    })
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

      expect(response).toEqual(mockServiceLogoutResponse);
      expect(res.cookies.refresh_token.value).toBe("");
      expect(mockLogoutF).toBeCalledTimes(1);
      expect(mockLogoutF).toBeCalledWith(refreshToken);
    });
  });

  describe('AuthController - Auth Guards', () => {
    it('Jwt Auth Guard: should be successful result', async () => {
      const payloadPropertyName = 'id';
      const payloadPropertyValue = 1;
      const payload = { [payloadPropertyName]: payloadPropertyValue };
      const {jwtService, token} = getMockJWTServiceData({
        expiresIn: '600s',
        payload
      })
      const req = {
        user: null,
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const {mockContext, mockGetRequest, request} = getMockExecutionContextData({ req });

      const jwtAuthGuard = new JwtAuthGuard(jwtService);
      const result = jwtAuthGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockGetRequest).toBeCalledTimes(1);
      expect(request.user).toHaveProperty(payloadPropertyName, payloadPropertyValue);
    });
    it('Jwt Auth Guard: token should be expired', async () => {
      const expiresIn = 600;
      const payloadPropertyName = 'id';
      const payloadPropertyValue = 1;
      const payload = { [payloadPropertyName]: payloadPropertyValue };
      const {jwtService, token} = getMockJWTServiceData({
        expiresIn: `${expiresIn}s`,
        payload
      })

      const req = {
        user: null,
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const {mockContext, mockGetRequest} = getMockExecutionContextData({ req });

      const jwtAuthGuard = new JwtAuthGuard(jwtService);
      jest.useRealTimers();
      setTimeout(() => {
        try {
          jwtAuthGuard.canActivate(mockContext)
          sendPseudoError();
        } catch (err) {
          expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
          expect(err.message).toBe('Пользователь не авторизован');
          expect(mockGetRequest).toBeCalledTimes(1);
        }
      }, expiresIn * 1000);
      jest.runOnlyPendingTimers();
    });
    it('Jwt Auth Guard: should throw exception (no Bearer token in headers)', async () => {
      const expiresIn = 600;
      const payloadPropertyName = 'id';
      const payloadPropertyValue = 1;
      const payload = { [payloadPropertyName]: payloadPropertyValue };
      const {jwtService, token} = getMockJWTServiceData({
        expiresIn: `${expiresIn}s`,
        payload
      })

      const req = {
        user: null,
        headers: {
          authorization: `${token}`
        }
      }
      const {mockContext, mockGetRequest} = getMockExecutionContextData({ req });

      const jwtAuthGuard = new JwtAuthGuard(jwtService);
      try {
        jwtAuthGuard.canActivate(mockContext)
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(err.message).toBe('Пользователь не авторизован');
        expect(mockGetRequest).toBeCalledTimes(1);
      }
    });
    it('Jwt Auth Guard: should throw exception (incorrect Bearer token in headers)', async () => {
      const expiresIn = 600;
      const payloadPropertyName = 'id';
      const payloadPropertyValue = 1;
      const payload = { [payloadPropertyName]: payloadPropertyValue };
      const {jwtService, token} = getMockJWTServiceData({
        expiresIn: `${expiresIn}s`,
        payload
      })

      const req = {
        user: null,
        headers: {
          authorization: `Bearer ${token}1234`
        }
      }
      const {mockContext, mockGetRequest} = getMockExecutionContextData({ req });

      const jwtAuthGuard = new JwtAuthGuard(jwtService);
      try {
        jwtAuthGuard.canActivate(mockContext)
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(err.message).toBe('Пользователь не авторизован');
        expect(mockGetRequest).toBeCalledTimes(1);
      }
    });

    it('Refresh Token Guard: should be successful result', async () => {
      const userId = 1;
      const tokenUUID = '1dsfsdf';
      const {token} = getMockJWTServiceData({
        expiresIn: `600s`,
        payload: {},
        subject: `${userId}`,
        jwtId: `${tokenUUID}`
      })
      const {mockContext, mockGetRequest} = getMockExecutionContextData({
        cookiesVariable: [
          {key: 'refresh_token', value: token}
        ]
      });

      //const refreshTokenGuard = new RefreshTokenGuard();
      const result = refreshTokenGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockGetRequest).toBeCalledTimes(1);
    });
    it('Refresh Token Guard: should throw exception (no token in cookies)', async () => {
      const {mockContext, mockGetRequest} = getMockExecutionContextData({});
      //const refreshTokenGuard = new RefreshTokenGuard();

      try {
        refreshTokenGuard.canActivate(mockContext)
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Нет доступа');
        expect(mockGetRequest).toBeCalledTimes(1);
      }
    });
  });

  describe('AuthController - HttpExceptionFilter', () => {
    it('', async () => {
      const {mockArgumentsHost, mockGetResponse, response} = getMockArgumentsHostData({})
      const errorCode = HttpStatus.BAD_REQUEST;
      const errorMessage = 'Error message';
      httpExceptionFilter.catch(new HttpException(errorMessage, errorCode), mockArgumentsHost)
      const body = JSON.parse(response._getData());

      expect(response._getStatusCode()).toBe(errorCode);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(body.messages).toContainEqual(errorMessage);
      expect(body.data).toBeNull();
    });
  });
});
