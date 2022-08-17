import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { SetPhotosReqDTO } from "./SetPhotosReqDto";

describe('SetPhotosReqDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new SetPhotosReqDTO('small', 'large');
      const errors = await validateDto(SetPhotosReqDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new SetPhotosReqDTO(1, 2);
      const errors = await validateDto(SetPhotosReqDTO, dto);
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
      expect(errors[0].property).toBe('small');
      expect(errors[1].constraints.isString).toBe('Должно быть строкой');
      expect(errors[1].property).toBe('large');
    });
  });
});