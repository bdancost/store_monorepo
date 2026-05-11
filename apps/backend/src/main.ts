import * as dotenv from 'dotenv';
import * as path from 'path';

// Isso aponta para a pasta real do seu backend, não para a 'dist'
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🔍 Tentando carregar de:', path.resolve(process.cwd(), '.env'));
  console.log(
    '🔍 Database URL carregada:',
    process.env.DATABASE_URL ? 'Sim' : 'Não',
  );

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
