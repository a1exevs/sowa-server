import { GetProfileResDTO } from "./GetProfileResDTO";
import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";

describe('GetProfileResDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new GetProfileResDTO(
      'fullName',
      'aboutMe',
      true,
      'description',
      {},
      {},
    );
    checkForApiProperties(dto, GetProfileResDTO);
  })
});