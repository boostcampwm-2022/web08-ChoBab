import { AllExceptionsFilter } from '@common/filters/exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TemplateInterceptor } from '@common/interceptors/template.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TemplateInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
      transform: true, // 컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
    })
  );
  await app.listen(3000);
}
bootstrap();
