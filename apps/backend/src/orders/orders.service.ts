import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, OrderStatus } from '@prisma/client';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: { id: true; title: true; image: true };
        };
      };
    };
  };
}>;

type PlainOrder = Prisma.OrderGetPayload<Record<never, never>>;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromCart(userId: string): Promise<PlainOrder> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Carrinho vazio ou não encontrado');
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const newOrder: PlainOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });
  } // <- essa chave estava faltando

  findAllByUser(userId: string): Promise<OrderWithItems[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, image: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, orderId: string): Promise<OrderWithItems> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, image: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<PlainOrder> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async cancel(userId: string, orderId: string): Promise<PlainOrder> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    const cancellableStatuses: OrderStatus[] = ['PENDING', 'PAID'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Pedido com status ${order.status} não pode ser cancelado`,
      );
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }
}
