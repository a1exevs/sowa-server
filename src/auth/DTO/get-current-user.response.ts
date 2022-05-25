import { ApiProperty } from "@nestjs/swagger";

export namespace GetCurrentUserResponse {
  export class User {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly email: string;

    constructor(props: User) {
      this.id = props.id;
      this.email = props.email;
    }
  }

  export namespace Swagger {
    export class GetCurrentUserResponseUser extends User {}
  }
}