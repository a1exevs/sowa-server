import { CommonResponse } from "../dto/common.response";
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ResultCodes } from '../constants/result-codes'

export const sendResponse = (exception: HttpException, response: Response, resultCode: number = ResultCodes.ERROR, messages: string[] = []) => {
  const status = exception.getStatus();
  let messagesList = [];
  if(exception.message)
    if(Array.isArray(exception.message))
      messagesList = [ ...exception.message ];
    else messagesList = [ exception.message ];

  if(messages.length)
    messagesList = messagesList.concat(messages);

  response
    .status(status)
    .json(
      new CommonResponse.Dto({
        messages: messagesList,
        resultCode
      }
    ));
}