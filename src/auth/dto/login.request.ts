import { IsOptional, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ErrorMessages } from "../../common/constants/error-messages";

export namespace LoginRequest {
  export class Dto {
    @ApiProperty()
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly email: string;

    @ApiProperty()
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    readonly password: string;

    @ApiProperty()
    @IsString({message: ErrorMessages.ru.MUST_BE_A_STRING})
    @IsOptional()
    readonly captcha?: string;

    constructor(email, password, captcha = null) {
      this.email = email;
      this.password = password;
      if (captcha)
        this.captcha = captcha
    }
  }
}