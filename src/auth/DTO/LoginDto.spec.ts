import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { LoginDto } from "./LoginDto";

describe('LoginDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new LoginDto('test@gmail.com', '12345678');
      const errors = await validateDto(LoginDto, dto);
      expect(errors.length).toBe(0);
    });
    it('should be successful result (with captcha)', async () => {
      const dto = new LoginDto('test@gmail.com', '12345678', '1234');
      const errors = await validateDto(LoginDto, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new LoginDto(1, 1);
      const errors = await validateDto(LoginDto, dto);
      expect(errors.length).toBe(2);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
      expect(errors[0].constraints.isEmail).toBeUndefined();
      expect(errors[1].property).toBe('password');
      expect(errors[1].constraints.isString).toBe('Должно быть строкой');
      expect(errors[1].constraints.isLength).toBeUndefined();
    });
    it('should has errors (values are not strings. With captcha)', async () => {
      const dto = new LoginDto(1, 1, 1);
      const errors = await validateDto(LoginDto, dto);
      expect(errors.length).toBe(3);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
      expect(errors[0].constraints.isEmail).toBeUndefined();
      expect(errors[1].property).toBe('password');
      expect(errors[1].constraints.isString).toBe('Должно быть строкой');
      expect(errors[1].constraints.isLength).toBeUndefined();
      expect(errors[2].property).toBe('captcha');
      expect(errors[2].constraints.isString).toBe('Должно быть строкой');
    });
  })
});