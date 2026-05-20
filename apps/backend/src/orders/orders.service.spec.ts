import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

// O $transaction precisa de mock especial
// pois recebe um callback e executa dentro de uma transação
const mockPrismaService = {
  cart: {
    findUnique: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  cartItem: {
    deleteMany: jest.fn(),
  },
  // $transaction recebe um callback e executa
  // Aqui simulamos executando o callback com o próprio mock
  $transaction: jest.fn((callback: (tx: unknown) => Promise<unknown>) =>
    callback(mockPrismaService),
  ),
};

// Fixture de carrinho com produtos para createFromCart
const mockCartWithProducts = {
  id: 'cart-123',
  userId: 'user-123',
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      quantity: 2,
      product: { id: 'prod-1', price: 100 },
    },
    {
      id: 'item-2',
      productId: 'prod-2',
      quantity: 1,
      product: { id: 'prod-2', price: 200 },
    },
  ],
};

const mockOrder = {
  id: 'order-123',
  userId: 'user-123',
  status: 'PENDING' as const,
  total: 400,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('createFromCart', () => {
    it('deve criar pedido com o total correto', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithProducts);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      await service.createFromCart('user-123');

      // Total: (2 * 100) + (1 * 200) = 400
      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123',
            total: 400,
            status: 'PENDING',
          }),
        }),
      );
    });

    it('deve criar OrderItems com preço snapshottado', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithProducts);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      await service.createFromCart('user-123');

      expect(mockPrismaService.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            items: {
              create: [
                // Snapshot do preço no momento da compra
                { productId: 'prod-1', quantity: 2, price: 100 },
                { productId: 'prod-2', quantity: 1, price: 200 },
              ],
            },
          }),
        }),
      );
    });

    it('deve limpar o carrinho após criar o pedido', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithProducts);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      await service.createFromCart('user-123');

      // Carrinho deve ser limpo após o pedido
      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-123' },
      });
    });

    it('deve lançar BadRequestException para carrinho vazio', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue({
        id: 'cart-empty',
        userId: 'user-123',
        items: [], // carrinho vazio
      });

      await expect(service.createFromCart('user-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se carrinho não existir', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(null);

      await expect(service.createFromCart('user-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve executar dentro de uma transação', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCartWithProducts);
      mockPrismaService.order.create.mockResolvedValue(mockOrder);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      await service.createFromCart('user-123');

      // Verifica que $transaction foi usado
      // Garante atomicidade — se deleteMany falhar,
      // o order.create é revertido automaticamente
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('deve cancelar pedido PENDING', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'CANCELLED',
      });

      const result = await service.cancel('user-123', 'order-123');

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: { status: 'CANCELLED' },
      });
      expect(result.status).toBe('CANCELLED');
    });

    it('deve cancelar pedido PAID', async () => {
      const paidOrder = { ...mockOrder, status: 'PAID' as const };
      mockPrismaService.order.findUnique.mockResolvedValue(paidOrder);
      mockPrismaService.order.update.mockResolvedValue({
        ...paidOrder,
        status: 'CANCELLED',
      });

      await expect(
        service.cancel('user-123', 'order-123'),
      ).resolves.not.toThrow();
    });

    it('deve lançar BadRequestException para pedido SHIPPED', async () => {
      const shippedOrder = { ...mockOrder, status: 'SHIPPED' as const };
      mockPrismaService.order.findUnique.mockResolvedValue(shippedOrder);

      await expect(service.cancel('user-123', 'order-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException para pedido DELIVERED', async () => {
      const deliveredOrder = { ...mockOrder, status: 'DELIVERED' as const };
      mockPrismaService.order.findUnique.mockResolvedValue(deliveredOrder);

      await expect(service.cancel('user-123', 'order-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar ForbiddenException se pedido pertencer a outro usuário', async () => {
      const otherUserOrder = { ...mockOrder, userId: 'outro-user' };
      mockPrismaService.order.findUnique.mockResolvedValue(otherUserOrder);

      await expect(service.cancel('user-123', 'order-123')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve lançar NotFoundException se pedido não existir', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.cancel('user-123', 'order-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar pedidos do usuário', async () => {
      const orders = [mockOrder, { ...mockOrder, id: 'order-456' }];
      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAllByUser('user-123');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
        }),
      );
    });

    it('deve retornar array vazio se usuário não tem pedidos', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);

      const result = await service.findAllByUser('user-sem-pedidos');
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar o pedido se pertencer ao usuário', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        ...mockOrder,
        items: [],
      });

      const result = await service.findOne('user-123', 'order-123');
      expect(result.id).toBe('order-123');
    });

    it('deve lançar NotFoundException se pedido não existir', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('user-123', 'order-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException para pedido de outro usuário', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        ...mockOrder,
        userId: 'outro-user',
        items: [],
      });

      await expect(service.findOne('user-123', 'order-123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
