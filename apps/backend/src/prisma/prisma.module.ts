import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Faz com que o PrismaService fique disponível em todo o projeto sem precisar importar em cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
