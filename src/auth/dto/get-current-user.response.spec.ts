import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";
import { GetCurrentUserResponse } from "./get-current-user.response";

describe('GetCurrentUserResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new GetCurrentUserResponse.Dto({ id: 1, email: 'email' })
    checkForApiProperties(dto, GetCurrentUserResponse.Dto);
  });
});