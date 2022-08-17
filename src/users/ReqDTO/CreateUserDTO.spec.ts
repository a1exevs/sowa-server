import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { CreateUserDTO } from "./CreateUserDTO";

describe('CreateUserDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new CreateUserDTO('test@gmail.com', '12345678');
      const errors = await validateDto(CreateUserDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should be successful result (password has 50 symbols', async () => {
      const dto = new CreateUserDTO('test@gmail.com', '12345678901234567890123456789012345678901234567890');
      const errors = await validateDto(CreateUserDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new CreateUserDTO(1, 1);
      const errors = await validateDto(CreateUserDTO, dto);
      expect(errors.length).toBe(2);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
      expect(errors[0].constraints.isEmail).toBe('Некорректный email');
      expect(errors[1].property).toBe('password');
      expect(errors[1].constraints.isString).toBe('Должно быть строкой');
      expect(errors[1].constraints.isLength).toBe('Длина должна быть больше 8 и меньше 50 символов');
    });
    it('should has error (incorrect email)', async () => {
      const dto = new CreateUserDTO('emailmailcom', '12345678');
      const errors = await validateDto(CreateUserDTO, dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints.isString).toBeUndefined();
      expect(errors[0].constraints.isEmail).toBe('Некорректный email');
    });
    it('should has error (password has less symbols than 8)', async () => {
      const dto = new CreateUserDTO('email@mail.com', '1234567');
      const errors = await validateDto(CreateUserDTO, dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.isString).toBeUndefined();
      expect(errors[0].constraints.isLength).toBe('Длина должна быть больше 8 и меньше 50 символов');
    });
    it('should has error (password has greater symbols than 50)', async () => {
      const dto = new CreateUserDTO('email@mail.com', '123456789012345678901234567890123456789012345678901');
      const errors = await validateDto(CreateUserDTO, dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints.isString).toBeUndefined();
      expect(errors[0].constraints.isLength).toBe('Длина должна быть больше 8 и меньше 50 символов');
    });
  })
});