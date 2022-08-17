import { AuthenticationResDto } from "./AuthenticationResDto";
import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";

describe('AuthenticationResDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const userId = 1;
    const token = 'token'
    const dto = new AuthenticationResDto(userId, token);
    checkForApiProperties(dto, AuthenticationResDto);
  });
});