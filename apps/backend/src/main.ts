import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define que todas as rotas começarão com /api (ex: localhost:3000/api/products)
  // Isso é prática comum em Big Techs para versionamento e organização.
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
