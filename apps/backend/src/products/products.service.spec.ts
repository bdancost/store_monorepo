import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  // Criamos uma lista de produtos "fake" para o teste
  const mockProducts = [
    {
      id: '1',
      title: 'Camiseta',
      price: 50.0,
      description: 'Desc',
      category: 'Roupas',
      image: 'url',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            // Simulamos a função findMany do Prisma
            product: {
              findMany: jest.fn().mockResolvedValue(mockProducts),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnValue({
              pipe: jest.fn(), // O HttpService do Nest usa Observables/RxJS
            }),
          },
        }, // Mock do serviço HTTP
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve retornar uma lista de produtos', async () => {
    const findManySpy = jest.spyOn(prisma.product, 'findMany');
    const result = await service.findAll();
    expect(result).toEqual(mockProducts);
    expect(findManySpy).toHaveBeenCalledTimes(1);
  });
});
