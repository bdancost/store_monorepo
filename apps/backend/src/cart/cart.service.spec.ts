import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock detalhado do Prisma para o CartService
// Todos os métodos que o service usa precisam estar aqui
const mockPrismaService = {
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
};

// Fixture de carrinho com itens
// Representa o retorno do Prisma com includes
const mockCartWithItems = {
  id: 'cart-123',
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: 'item-1',
      cartId: 'cart-123',
      productId: 'prod-1',
      quantity: 2,
      product: {
        id: 'prod-1',
        title: 'iPhone',
        price: 999,
        description: '',
        category: 'smartphones',
        image: '',
        externalId: null,
      },
    },
  ],
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    jest.clearAllMocks();
  });

  describe('getOrCreateCart', () => {
    it('deve retornar o carrinho existente se encontrado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithItems);

      const result = await service.getOrCreateCart('user-123');

      expect(result).toEqual(mockCartWithItems);
      // create NÃO deve ser chamado se o carrinho já existe
      expect(mockPrismaService.cart.create).not.toHaveBeenCalled();
    });

    it('deve criar um novo carrinho se não existir', async () => {
      // findUnique retorna null — carrinho não existe
      mockPrismaService.cart.findUnique.mockResolvedValue(null);
      mockPrismaService.cart.create.mockResolvedValue(mockCartWithItems);

      const result = await service.getOrCreateCart('user-123');

      // create deve ter sido chamado com o userId correto
      expect(mockPrismaService.cart.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 'user-123' },
        }),
      );
      expect(result).toEqual(mockCartWithItems);
    });

    it('deve buscar com include de items e product', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithItems);

      await service.getOrCreateCart('user-123');

      // Verifica que o include correto foi passado
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
          include: expect.objectContaining({
            items: expect.objectContaining({
              include: expect.objectContaining({ product: true }),
            }),
          }),
        }),
      );
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      // getOrCreateCart sempre retorna o carrinho mock
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithItems);
    });

    it('deve criar novo item se produto não está no carrinho', async () => {
      // findFirst retorna null — produto não está no carrinho ainda
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue({
        id: 'item-new',
        cartId: 'cart-123',
        productId: 'prod-2',
        quantity: 1,
      });

      await service.addToCart('user-123', 'prod-2', 1);

      expect(mockPrismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-123',
          productId: 'prod-2',
          quantity: 1,
        },
      });
    });

    it('deve incrementar a quantidade se produto já está no carrinho', async () => {
      const existingItem = {
        id: 'item-1',
        cartId: 'cart-123',
        productId: 'prod-1',
        quantity: 2,
      };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(existingItem);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...existingItem,
        quantity: 5,
      });

      await service.addToCart('user-123', 'prod-1', 3);

      // 2 existentes + 3 novos = 5
      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });

    it('não deve chamar create se o item já existe', async () => {
      mockPrismaService.cartItem.findFirst.mockResolvedValue({
        id: 'item-1',
        quantity: 1,
      });
      mockPrismaService.cartItem.update.mockResolvedValue({});

      await service.addToCart('user-123', 'prod-1', 1);

      expect(mockPrismaService.cartItem.create).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('deve deletar o item corretamente', async () => {
      const deletedItem = {
        id: 'item-1',
        cartId: 'cart-123',
        productId: 'prod-1',
        quantity: 1,
      };
      mockPrismaService.cartItem.delete.mockResolvedValue(deletedItem);

      // Mock para validateOwnership
      mockPrismaService.cartItem.findUnique.mockResolvedValue({
        ...deletedItem,
        cart: { userId: 'user-123' },
      });

      const result = await service.removeItem('user-123', 'item-1');

      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
      expect(result).toEqual(deletedItem);
    });

    it('deve lançar NotFoundException se item não existir', async () => {
      mockPrismaService.cartItem.findUnique.mockResolvedValue(null);

      await expect(
        service.removeItem('user-123', 'item-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException se item pertencer a outro usuário', async () => {
      mockPrismaService.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId: 'outro-user' }, // dono diferente
      });

      await expect(service.removeItem('user-123', 'item-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateItemQuantity', () => {
    it('deve atualizar a quantidade corretamente', async () => {
      mockPrismaService.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cart: { userId: 'user-123' },
      });
      mockPrismaService.cartItem.update.mockResolvedValue({
        id: 'item-1',
        quantity: 5,
      });

      await service.updateItemQuantity('user-123', 'item-1', 5);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });
  });
});
