import { ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) : Promise<any> {
    const intPipe = new ParseIntPipe();
    await intPipe.transform(value, metadata);

    if(value < 0)
      throw new BadRequestException("Numeric must not be less than 0");

    return value;
  }
}