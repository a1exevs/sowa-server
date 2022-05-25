import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResDTO } from "../ResDTO/CommonResDTO";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, CommonResDTO> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<CommonResDTO> {
    return next.handle().pipe(map(data => {
      const res = new CommonResDTO();
      res.data = data;
      return res;
    }));
  }
}
