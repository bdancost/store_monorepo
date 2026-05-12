import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('✅ Conexão com o banco estabelecida com sucesso!');
    } catch (error) {
      console.error('❌ Erro crítico ao conectar no banco de dados:', error);

      if (!process.env.DATABASE_URL) {
        console.error('⚠️ DATABASE_URL não encontrada no ambiente!');
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
