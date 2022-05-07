import { CommonResDTO } from "../ResDTO/CommonResDTO";
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ResultCodes } from '../constants/resultcodes'

export const sendResponse = (exception: HttpException, response: Response, resultCode: number = ResultCodes.ERROR, messages: string[] = []) => {
  const status = exception.getStatus();
  const body = new CommonResDTO();
  if(exception.message)
    if(Array.isArray(exception.message))
      body.messages = [ ...exception.message ];
    else body.messages = [ exception.message ];

  if(messages.length)
    body.messages = body.messages.concat(messages);

  body.resultCode = resultCode;
  response
    .status(status)
    .json(body);
}