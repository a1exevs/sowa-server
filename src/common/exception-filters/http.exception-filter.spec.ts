import { getMockArgumentsHostData } from "../../../test/unit/helpers/context-helper.spec";
import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpExceptionFilter } from "./http.exception-filter";

describe('HttpExceptionFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  describe('catch', () => {
    it('should catch exception', async () => {
      const { mockArgumentsHost, mockGetResponse, response } = getMockArgumentsHostData({})
      const errorCode = HttpStatus.BAD_REQUEST;
      const errorMessage = 'Error message';
      const httpExceptionFilter = new HttpExceptionFilter();
      httpExceptionFilter.catch(new HttpException(errorMessage, errorCode), mockArgumentsHost)
      const body = JSON.parse(response._getData());

      expect(response._getStatusCode()).toBe(errorCode);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(body.messages).toContainEqual(errorMessage);
      expect(body.data).toBeNull();
    });
  });
})