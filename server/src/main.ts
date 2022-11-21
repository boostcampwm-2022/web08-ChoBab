import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TemplateInterceptor } from './common/interceptors/template.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TemplateInterceptor());
  await app.listen(3000);
}
bootstrap();
