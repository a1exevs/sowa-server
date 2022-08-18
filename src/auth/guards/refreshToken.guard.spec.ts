import { getMockJWTServiceData } from "../../../test-helpers/jwt-helper.spec";
import { getMockExecutionContextData } from "../../../test-helpers/context-helper.spec";
import { sendPseudoError } from "../../../test-helpers/tests-helper.spec";
import { HttpStatus } from "@nestjs/common";
import { RefreshTokenGuard } from "./refreshToken.guard";

describe('RefreshTokenGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  describe('canActivate', () => {
    it('should be successful result', async () => {
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

      const refreshTokenGuard = new RefreshTokenGuard();
      const result = refreshTokenGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockGetRequest).toBeCalledTimes(1);
    });
    it('should throw exception (no token in cookies)', async () => {
      const {mockContext, mockGetRequest} = getMockExecutionContextData({});
      const refreshTokenGuard = new RefreshTokenGuard();

      try {
        refreshTokenGuard.canActivate(mockContext)
        sendPseudoError();
      } catch (err) {
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Нет доступа');
        expect(mockGetRequest).toBeCalledTimes(1);
      }
    });
  })
})