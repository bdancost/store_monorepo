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
    const result = await service.findAll();

    // Verificamos se o resultado é igual ao nosso mock
    expect(result).toEqual(mockProducts);

    // Use o jest.spyOn para observar o método sem "desgrudá-lo" do objeto
    // Isso silencia o ESLint e funciona perfeitamente no Jest
    const findManySpy = jest.spyOn(prisma.product, 'findMany');
    expect(findManySpy).toHaveBeenCalledTimes(1);
  });
});
