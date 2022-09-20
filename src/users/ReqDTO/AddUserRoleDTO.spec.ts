import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { AddUserRoleDTO } from "./AddUserRoleDTO";
import { ErrorMessages } from "../../common/constants/error-messages";

describe('AddUserRoleDto', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new AddUserRoleDTO('admin', 1);
      const errors = await validateDto(AddUserRoleDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values have incorrect types)', async () => {
      const dto = new AddUserRoleDTO(1, '1');
      const errors = await validateDto(AddUserRoleDTO, dto);
      expect(errors[0].constraints.isString).toBe(ErrorMessages.ru.MUST_BE_A_STRING);
      expect(errors[0].property).toBe('value');
      expect(errors[1].constraints.isNumber).toBe(ErrorMessages.ru.MUST_BE_A_NUMBER);
      expect(errors[1].property).toBe('userId');
    });
  });
});