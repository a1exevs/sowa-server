import { ApiResult } from "./api-result.decorator";
import { CommonResDTO } from "../../common/ResDTO/CommonResDTO";

const STATUS = 5
const DESCRIPTION = 'DESCRIPTION'

class TestType {}

class TestClass {
  @ApiResult({status: STATUS, description: DESCRIPTION, type: TestType})
  public testFunction() {}
}

describe('ApiResultDecorator', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should set metadata with apiExtraModels and apiResponse decorators keys', () => {
    const testClass = new TestClass();
    testClass.testFunction();
    const models = Reflect.getMetadata('swagger/apiExtraModels', TestClass.prototype.testFunction);
    const responseData = Reflect.getMetadata('swagger/apiResponse', TestClass.prototype.testFunction)
    expect(models).toEqual([CommonResDTO, TestType]);
    expect(responseData[STATUS]).toBeDefined();
    expect(responseData[STATUS].description).toBe(DESCRIPTION);
  });
});