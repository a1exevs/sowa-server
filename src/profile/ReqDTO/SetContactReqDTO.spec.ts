import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { SetContactReqDTO } from "./SetContactReqDTO";
import { ErrorMessages } from "../../common/constants/error-messages";

describe('SetContactReqDTO', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto = new SetContactReqDTO(
        'facebook',
        'website',
        'twitter',
        'instagram',
        'youtube',
        'github',
        'vk',
        'mainLink'
      );

      const errors = await validateDto(SetContactReqDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new SetContactReqDTO(1, 2, 3, 4, 5, 6, 7, 8);
      const errors = await validateDto(SetContactReqDTO, dto);
      expect.assertions(1 + Object.keys(dto).length * 2);
      expect(errors.length).toBe(Object.keys(dto).length);
      errors.forEach((error, index: number) => {
        expect(error.constraints.isString).toBe(ErrorMessages.ru.MUST_BE_A_STRING);
        expect(error.property).toBe(Object.keys(dto)[index]);
      })
    });
  })
});