import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";
import { GetUserContactResponse } from "./get-user-contact.response";

describe('GetUserContactResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new GetUserContactResponse.Dto({
      facebook: 'facebook',
      website: 'website',
      twitter: 'twitter',
      instagram: 'instagram',
      youtube: 'youtube',
      github: 'github',
      vk: 'vk',
      mainLink: 'mainLink'
    });
    checkForApiProperties(dto, GetUserContactResponse.Dto);
  });
});