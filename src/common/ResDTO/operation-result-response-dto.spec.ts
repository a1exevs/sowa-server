import { checkForApiProperties } from "../../../test-helpers/response-dto-helper.spec";
import { OperationResultResponseDto } from "./operation-result-response-dto";

describe('OperationResultResponseDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new OperationResultResponseDto('success');
    checkForApiProperties(dto, OperationResultResponseDto);
  });
});