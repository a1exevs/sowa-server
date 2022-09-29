import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";
import { OperationResultResponse } from "./operation-result.response";

describe('OperationResultResponse', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should has ApiProperty decorator for all properties', () => {
    const dto = new OperationResultResponse.Dto({ result: 'success' });
    checkForApiProperties(dto, OperationResultResponse.Dto);
  });
});