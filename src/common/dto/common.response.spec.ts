import { AuthenticationResponse } from "../../auth/dto/authentication.response";
import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";
import { CommonResponse } from "./common.response";

describe('CommonResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new CommonResponse.Dto();
    checkForApiProperties(dto, CommonResponse.Dto);
  });
});