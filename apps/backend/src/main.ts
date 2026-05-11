import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod'; // Adicione isso
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  // Troque o ValidationPipe global por este:
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
