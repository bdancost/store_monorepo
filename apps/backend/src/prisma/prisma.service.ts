import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    // Conecta ao banco de dados assim que o módulo iniciar
    await this.$connect();
  }
  async onModuleDestroy() {
    // Desconecta do banco de dados assim que o módulo for destruído
    await this.$disconnect();
  }
}
