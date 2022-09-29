import { RegisterRequest } from "../../auth/dto/register.request";

export namespace CreateUserRequest {
  export class Dto extends RegisterRequest.Dto {}
}