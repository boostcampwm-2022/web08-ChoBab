import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResTemplateType<T> {
  message: string;
  data: T;
}

@Injectable()
export class TemplateInterceptor<T> implements NestInterceptor<T, ResTemplateType<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResTemplateType<T>> {
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        data: data.data,
      }))
    );
  }
}
