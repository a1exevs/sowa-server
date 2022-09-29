import { validateDto } from "../../../test/unit/helpers/validation-helper.spec";
import { SetUserAvatarRequest } from "./set-user-avatar.request";
import { ErrorMessages } from "../../common/constants/error-messages";

describe('SetUserAvatarRequest', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new SetUserAvatarRequest.Dto('small', 'large');
      const errors = await validateDto(SetUserAvatarRequest.Dto, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new SetUserAvatarRequest.Dto(1, 2);
      const errors = await validateDto(SetUserAvatarRequest.Dto, dto);
      expect(errors[0].constraints.isString).toBe(ErrorMessages.ru.MUST_BE_A_STRING);
      expect(errors[0].property).toBe('small');
      expect(errors[1].constraints.isString).toBe(ErrorMessages.ru.MUST_BE_A_STRING);
      expect(errors[1].property).toBe('large');
    });
  });
});