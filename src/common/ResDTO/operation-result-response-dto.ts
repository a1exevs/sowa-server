import { ApiProperty } from "@nestjs/swagger";

export class OperationResultResponseDto {
  constructor(props) {
    this.result = props
  }

  @ApiProperty()
  readonly result: any;
}