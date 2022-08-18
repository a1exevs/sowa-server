import { CreatePostDTO } from "./CreatePostDTO";
import { validateDto } from "../../../test-helpers/validation-helper.spec";

describe('CreatePostDTO', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const dto: CreatePostDTO = { title: 'title', content: 'content' };
      const errors = await validateDto(CreatePostDTO, dto);
      expect(errors.length).toBe(0);
    });
    it('should has errors (values are not strings)', async () => {
      const dto = new CreatePostDTO(1, 1);
      const errors = await validateDto(CreatePostDTO, dto);
      expect(errors.length).toBe(2);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints.isString).toBe('Должно быть строкой');
      expect(errors[1].property).toBe('content');
      expect(errors[1].constraints.isString).toBe('Должно быть строкой');
    });
  })
});