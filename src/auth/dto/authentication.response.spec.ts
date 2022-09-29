import { AuthenticationResponse } from "./authentication.response";
import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";

describe('AuthenticationResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const userId = 1;
    const accessToken = 'token'
    const dto = new AuthenticationResponse.Dto({ userId, accessToken });
    checkForApiProperties(dto, AuthenticationResponse.Dto);
  });
});