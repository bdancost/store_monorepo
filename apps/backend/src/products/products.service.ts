import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

// Definimos a interface para evitar o erro de 'any'
interface ExternalProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    const count = await this.prisma.product.count();
    if (count === 0) {
      await this.syncProducts();
    }
  }

  async syncProducts() {
    // Tipamos a resposta da Promise como ExternalProduct[]
    const response = await firstValueFrom(
      this.httpService.get<ExternalProduct[]>(
        'https://fakestoreapi.com/products',
      ),
    );

    const { data } = response;

    // Usando createMany para performance e segurança de tipos
    const productsToSave = data.map((item) => ({
      externalId: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image,
    }));

    await this.prisma.product.createMany({
      data: productsToSave,
    });

    console.log('📦 Produtos sincronizados com sucesso!');
  }

  findAll() {
    return this.prisma.product.findMany();
  }
}
