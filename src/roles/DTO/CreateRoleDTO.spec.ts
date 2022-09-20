import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { CreateRoleDTO } from "./CreateRoleDTO";
import { ErrorMessages } from "../../common/constants/error-messages";

describe('CreateRoleDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new CreateRoleDTO('admin', 'Admin role');
      const errors = await validateDto(CreateRoleDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new CreateRoleDTO(1, 2);
      const errors = await validateDto(CreateRoleDTO, dto);
      expect(errors[0].constraints.isString).toBe(ErrorMessages.ru.MUST_BE_A_STRING);
      expect(errors[0].property).toBe('value');
      expect(errors[1].constraints.isString).toBe(ErrorMessages.ru.MUST_BE_A_STRING);
      expect(errors[1].property).toBe('description');
    });
  });
});