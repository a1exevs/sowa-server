import { validateDto } from "../../../test-helpers/validation-helper.spec";
import { GetUsersQuery } from "./GetUsersQuery";

describe('GetUsersQuery', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should be successful result', async () => {
      const query = new GetUsersQuery(1, 1);
      const errors = await validateDto(GetUsersQuery, query);
      expect(errors.length).toBe(0);
    });
    it('should be successful result (max count value)', async () => {
      const query = new GetUsersQuery(1, 100);
      const errors = await validateDto(GetUsersQuery, query);
      expect(errors.length).toBe(0);
    });
    it('should has errors (incorrect values of page and count)', async () => {
      const query = new GetUsersQuery(0, 101);
      const errors = await validateDto(GetUsersQuery, query);
      expect(errors.length).toBe(2);
      expect(errors[0].constraints.min).toBeDefined();
      expect(errors[0].property).toBe('page');
      expect(errors[1].constraints.max).toBeDefined();
      expect(errors[1].property).toBe('count');
    });
    it('should has errors (values are not integers)', async () => {
      const query = new GetUsersQuery('page', 'count');
      const errors = await validateDto(GetUsersQuery, query);
      expect(errors.length).toBe(2);
      expect(errors[0].constraints.min).toBeDefined();
      expect(errors[0].property).toBe('page');
      expect(errors[1].constraints.max).toBeDefined();
      expect(errors[1].property).toBe('count');
    });
  });
});