import { AuthenticationResDto } from "../../auth/DTO/AuthenticationResDto";
import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";
import { CommonResDTO } from "./CommonResDTO";

describe('CommonResDTO', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new CommonResDTO();
    checkForApiProperties(dto, CommonResDTO);
  });
});