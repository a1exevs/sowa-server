import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { AddUserRoleDTO } from "./AddUserRoleDTO";

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
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
      expect(errors[0].property).toBe('value');
      expect(errors[1].constraints.isNumber).toBe('Должно быть числом');
      expect(errors[1].property).toBe('userId');
    });
  });
});