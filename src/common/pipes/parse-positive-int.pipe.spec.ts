import { ParsePositiveIntPipe } from "./parse-positive-int.pipe";
import { ArgumentMetadata, HttpStatus } from "@nestjs/common";
import { sendPseudoError } from "../../../test/unit/helpers/tests-helper.spec";
import { ErrorMessages } from "../constants/error-messages";
import './../../../string.extensions'

describe('ParsePositiveIntPipe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('transform', () => {
    it('should be successful result (value is equal 0)', async () => {
      expect.assertions(1);
      let target: ParsePositiveIntPipe = new ParsePositiveIntPipe();
      const metadata: ArgumentMetadata = { type: 'param', metatype: Number };
      const value = 0;
      const result = await target.transform(value, metadata)
      expect(result).toBe(value);
    });
    it('should be successful result (value is more then 0)', async () => {
      expect.assertions(1);
      let target: ParsePositiveIntPipe = new ParsePositiveIntPipe();
      const metadata: ArgumentMetadata = { type: 'param', metatype: Number };
      const value = 5;
      const result = await target.transform(value, metadata)
      expect(result).toBe(value);
    });
    it('should throw exception (value is a negative number)', async () => {
      let target: ParsePositiveIntPipe = new ParsePositiveIntPipe();
      const metadata: ArgumentMetadata = { type: 'param', metatype: Number };
      try {
        await target.transform(-1, metadata)
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(ErrorMessages.ru.NUMERIC_MUST_NOT_BE_LESS_THAN_N.format(0));
      }
    });
    it('should throw exception (value is string)', async () => {
      let target: ParsePositiveIntPipe = new ParsePositiveIntPipe();
      const metadata: ArgumentMetadata = { type: 'param', metatype: String };
      try {
        await target.transform('a', metadata)
        sendPseudoError();
      } catch (error) {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('Validation failed (numeric string is expected)');
      }
    });
  });
});