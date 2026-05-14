import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  // Troque o ValidationPipe global por este:
  app.useGlobalPipes(new ZodValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
