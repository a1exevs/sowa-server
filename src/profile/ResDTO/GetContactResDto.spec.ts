import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";
import { GetContactResDto } from "./GetContactResDto";

describe('GetContactResDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new GetContactResDto(
      'facebook',
      'website',
      'twitter',
      'instagram',
      'youtube',
      'github',
      'vk',
      'mainLink'
    );
    checkForApiProperties(dto, GetContactResDto);
  });
});