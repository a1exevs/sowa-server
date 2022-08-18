import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { BanUserDTO } from "./BanUserDTO";

describe('BanUserDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new BanUserDTO(1, 'reason');
      const errors = await validateDto(BanUserDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values have incorrect types)', async () => {
      const dto = new BanUserDTO('1', 1);
      const errors = await validateDto(BanUserDTO, dto);
      expect(errors[0].constraints.isNumber).toBe('Должно быть числом');
      expect(errors[0].property).toBe('userId');
      expect(errors[1].constraints.isString).toBe('Должно быть строкой');
      expect(errors[1].property).toBe('banReason');
    });
  });
});