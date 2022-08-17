import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";
import { GetPhotosResDTO } from "./GetPhotosResDTO";

describe('GetPhotosResDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new GetPhotosResDTO('small', 'large');
    checkForApiProperties(dto, GetPhotosResDTO);
  });
});