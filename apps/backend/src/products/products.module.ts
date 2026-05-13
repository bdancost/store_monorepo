import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, PrismaModule, AuthModule], // Certifique-se de importar o PrismaModule aqui
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
