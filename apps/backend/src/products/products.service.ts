import {
  Injectable,
  OnModuleInit,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Interfaces para tipar a resposta externa (Contrato da API)
interface ExternalProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
}

interface DummyJsonResponse {
  products: ExternalProduct[];
}

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.prisma.product.count();
    if (count === 0) {
      // Usamos .catch aqui para não travar a inicialização do módulo se o sync falhar
      await this.syncProducts().catch((err: unknown) => {
        const stack = err instanceof Error ? err.stack : 'Sem stack trace';
        this.logger.error('Falha na sincronização inicial', stack);
      });
    }
  }

  async syncProducts(): Promise<void> {
    try {
      this.logger.log('Buscando produtos na DummyJSON API...');

      const { data } = await firstValueFrom(
        this.httpService.get<DummyJsonResponse>(
          'https://dummyjson.com/products?limit=100',
        ),
      );

      const productsToSave = data.products.map((item) => ({
        externalId: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.thumbnail,
      }));

      // createMany é muito mais performático que um loop de .create
      const created = await this.prisma.product.createMany({
        data: productsToSave,
        skipDuplicates: true,
      });

      this.logger.log(
        `✅ Sincronização concluída: ${created.count} novos produtos salvos.`,
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.stack : String(error);

      this.logger.error('Erro ao sincronizar produtos externos', errorMessage);
      throw new InternalServerErrorException(
        'Falha ao integrar com API de produtos',
      );
    }
  }

  async create(data: CreateProductDto): Promise<Product> {
    // Usando spread operator para código mais limpo
    return this.prisma.product.create({
      data: { ...data },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { ...data },
    });
  }

  async remove(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
