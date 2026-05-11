import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

// 1. Interface do produto individual da DummyJSON
interface ExternalProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
}

// 2. Interface da resposta da API (que contém o array e metadados)
interface DummyJsonResponse {
  products: ExternalProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.product.count();
      if (count === 0) {
        await this.syncProducts();
      }
    } catch (error) {
      console.error('❌ Erro ao verificar contagem de produtos:', error);
    }
  }

  async syncProducts() {
    // Tipamos a resposta com a interface que contém a chave 'products'
    const response = await firstValueFrom(
      this.httpService.get<DummyJsonResponse>(
        'https://dummyjson.com/products?limit=100',
      ),
    );

    // Agora o TS sabe que data tem a propriedade products
    const { products } = response.data;

    const productsToSave = products.map((item) => ({
      externalId: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.thumbnail,
    }));

    // Inserção em massa
    await this.prisma.product.createMany({
      data: productsToSave,
      skipDuplicates: true, // Boa prática para evitar erros de chave única
    });

    console.log(
      `🚀 ${productsToSave.length} produtos sincronizados com sucesso!`,
    );
  }

  findAll() {
    return this.prisma.product.findMany();
  }
}
