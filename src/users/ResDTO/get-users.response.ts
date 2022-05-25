import {ApiProperty} from "@nestjs/swagger";

export namespace GetUsersResponse {
  export class Avatar {
    @ApiProperty()
    public readonly small: string;

    @ApiProperty()
    public readonly large: string;
  }

  export class User {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly email: string;

    @ApiProperty()
    public readonly status: string;

    @ApiProperty()
    public readonly followed: boolean;

    @ApiProperty()
    public readonly avatar: Avatar;

    constructor(props: User) {
      this.id = props.id;
      this.email = props.email;
      this.status = props.status;
      this.followed = props.followed;
      this.avatar = props.avatar;
    }
  }

  export class Data {
    @ApiProperty({type: () => [Swagger.GetUsersResponseUser], description: "Массив пользователей"})
    public readonly items?: User[] = null;

    @ApiProperty({type: Number, example: "1234", description: "Общее количество пользователей"})
    public readonly totalCount?: number = 0;

    @ApiProperty({type: String, example: "1234", description: "Максимальный размер страницы - 100 пользователей"})
    public readonly error?: string = null;

    constructor(props: Data) {
      this.items = props.items;
      this.totalCount = props.totalCount;
      this.error = props.error;
    }
  }

  export namespace Swagger {
    export class GetUsersResponseData extends Data {}
    export class GetUsersResponseUser extends User {}
  }
}
