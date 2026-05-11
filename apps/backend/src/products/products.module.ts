import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule], // Certifique-se de importar o PrismaModule aqui
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
