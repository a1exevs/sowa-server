import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { SetUserStatusDTO } from "./SetUserStatusDTO";

describe('SetUserStatusDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto: SetUserStatusDTO = { status: 'status' }
      const errors = await validateDto(SetUserStatusDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should be successful result (empties status)', async () => {
      const dto: SetUserStatusDTO = { status: '' }
      const errors = await validateDto(SetUserStatusDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should be successful result (status has 30 symbols)', async () => {
      const dto: SetUserStatusDTO = { status: '123456789012345678901234567890' }
      const errors = await validateDto(SetUserStatusDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (status is not strings)', async () => {
      const dto = { status: 1 }
      // @ts-ignore
      const errors = await validateDto(SetUserStatusDTO, dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
    });
    it('should be successful result (status has greater symbols than 30)', async () => {
      const dto: SetUserStatusDTO = { status: '1234567890123456789012345678901' };
      const errors = await validateDto(SetUserStatusDTO, dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints.isLength).toBe('Длина должна быть меньше 30 символов');
    });
  })
});