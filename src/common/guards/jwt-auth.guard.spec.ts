import { JwtAuthGuard } from "./jwt-auth.guard";
import { sendPseudoError } from "../../../test/unit/helpers/tests-helper.spec";
import { HttpStatus } from "@nestjs/common";
import { getMockJWTServiceData } from "../../../test/unit/helpers/jwt-helper.spec";
import { getMockExecutionContextData } from "../../../test/unit/helpers/context-helper.spec";
import { ErrorMessages } from "../constants/error-messages";

describe('JwtAuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  describe('canActivate', () => {
    it('should be successful result', async () => {
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
      jest.useFakeTimers();
      expect.assertions(3);
      setTimeout(() => {
        try {
          jwtAuthGuard.canActivate(mockContext)
          sendPseudoError();
        } catch (err) {
          expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
          expect(err.message).toBe(ErrorMessages.ru.UNAUTHORIZED);
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
        expect(err.message).toBe(ErrorMessages.ru.UNAUTHORIZED);
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
        expect(err.message).toBe(ErrorMessages.ru.UNAUTHORIZED);
        expect(mockGetRequest).toBeCalledTimes(1);
      }
    });
  })
})