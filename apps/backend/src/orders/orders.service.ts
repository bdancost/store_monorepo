import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderItem, OrderStatus } from '@prisma/client';

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: {
      id: string;
      title: string;
      image: string;
    };
  })[];
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria o pedido a partir do carrinho ativo do usuário
  async createFromCart(userId: string): Promise<Order> {
    // 1. Busca o carrinho com os produtos
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // 2. Valida que o carrinho existe e não está vazio
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Carrinho vazio ou não encontrado');
    }

    // 3. Calcula o total snapshottando o preço atual de cada produto
    // O preço é salvo no OrderItem para não ser afetado por mudanças futuras
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // 4. Cria o pedido e os itens em uma única transação
    // Se qualquer operação falhar, tudo é revertido automaticamente
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // snapshot do preço
            })),
          },
        },
      });

      // 5. Limpa o carrinho após criar o pedido
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  // Lista todos os pedidos do usuário logado
  async findAllByUser(userId: string): Promise<OrderWithItems[]> {
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

  // Busca um pedido específico validando que pertence ao usuário
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

    // Garante que o usuário só acessa o próprio pedido
    if (order.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return order;
  }

  // Atualiza o status do pedido (uso admin no futuro)
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
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

  // Cancela o pedido com regra de negócio
  async cancel(userId: string, orderId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Ownership check
    if (order.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    // Só permite cancelar se ainda não foi enviado
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
