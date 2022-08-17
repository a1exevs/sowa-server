import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";
import { AuthenticationResponse } from "./AuthenticationResponse";

describe('AuthenticationResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new AuthenticationResponse()
    dto.status = 'success';
    dto.data = null
    checkForApiProperties(dto, AuthenticationResponse);
  });
});