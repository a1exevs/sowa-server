import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";
import { GetUserAvatarResponse } from "./get-user-avatar.response";

describe('GetUserAvatarResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new GetUserAvatarResponse.Dto({ small: 'small', large: 'large' });
    checkForApiProperties(dto, GetUserAvatarResponse.Dto);
  });
});