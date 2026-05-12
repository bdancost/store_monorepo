import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '@prisma/client'; // Importe o tipo gerado pelo Prisma
import { CreateProductDto } from './dto/create-product.dto';

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

  async onModuleInit(): Promise<void> {
    try {
      const count = await this.prisma.product.count();
      if (count === 0) {
        await this.syncProducts();
      }
    } catch (error) {
      console.error('❌ Erro ao verificar contagem de produtos:', error);
    }
  }

  async syncProducts(): Promise<void> {
    const response = await firstValueFrom(
      this.httpService.get<DummyJsonResponse>(
        'https://dummyjson.com/products?limit=100',
      ),
    );

    const { products } = response.data;

    const productsToSave = products.map((item) => ({
      externalId: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.thumbnail,
    }));

    await this.prisma.product.createMany({
      data: productsToSave,
      skipDuplicates: true,
    });

    console.log(`🚀 ${productsToSave.length} produtos sincronizados!`);
  }

  // ADICIONADO: Método create que o Controller precisa
  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        image: data.image,
      },
    });
  }

  // TIPADO: Retorno explícito para limpar o erro do ESLint
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }
}
