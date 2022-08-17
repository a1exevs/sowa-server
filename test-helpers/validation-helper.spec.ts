import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ClassConstructor } from "class-transformer/types/interfaces";

export const validateDto = async <T extends object, V extends T>(cls: ClassConstructor<T>, plain: V): Promise<ValidationError[]> => {
  const obj = plainToInstance(cls, plain);
  return await validate(obj);
}