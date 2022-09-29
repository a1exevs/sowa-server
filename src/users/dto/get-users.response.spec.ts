import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";
import { GetUsersResponse } from "./get-users.response";

describe('GetUsersResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const avatar: GetUsersResponse.Avatar = { small: 'small', large: 'large' }
    const user = new GetUsersResponse.User({
      id: 1,
      email: 'email',
      status: 'status',
      followed: true,
      avatar
    });
    const data = new GetUsersResponse.Data({
      items: [user],
      totalCount: 5,
      error: 'error'
    })
    checkForApiProperties(avatar, GetUsersResponse.Avatar);
    checkForApiProperties(user, GetUsersResponse.User);
    checkForApiProperties(data, GetUsersResponse.Data);
  });
});