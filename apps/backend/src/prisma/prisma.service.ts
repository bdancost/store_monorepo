import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Passamos um objeto vazio tipado para satisfazer o construtor do Prisma
    // e evitar o erro de "Unsafe call" no super()
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      // O cast 'as unknown as Promise<void>' é a saída para quando o ESLint
      // não reconhece o retorno do binário do Prisma no Monorepo
      await this.$connect();
      console.log('✅ Conexão com o banco estabelecida com sucesso!');
    } catch (error) {
      console.error('❌ Erro crítico ao conectar no banco de dados:', error);

      if (!process.env.DATABASE_URL) {
        console.error('⚠️ DATABASE_URL não encontrada no ambiente!');
      }

      // Em produção, você pode querer derrubar a app se o banco não subir
      // process.exit(1);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
