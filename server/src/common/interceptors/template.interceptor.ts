import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResTemplate<T> {
  message: string;
  data: T;
}

@Injectable()
export class TemplateInterceptor<T> implements NestInterceptor<T, ResTemplate<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResTemplate<T>> {
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        data: data.data,
      }))
    );
  }
}
