import { CommonResDTO } from "../ResDTO/CommonResDTO";
import { HttpException } from '@nestjs/common';
import { Response } from 'express';

export const sendResponse = (exception: HttpException, response: Response) => {
  const status = exception.getStatus();
  const body = new CommonResDTO();
  body.messages = [exception.message];
  body.resultCode = 1;
  response
    .status(status)
    .json(body);
}