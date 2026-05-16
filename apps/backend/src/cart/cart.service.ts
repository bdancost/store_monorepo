import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CartItem } from '@prisma/client';

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: { product: true };
    };
  };
}>;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(userId: string): Promise<CartWithItems> {
    const includeClause = {
      items: {
        include: { product: true },
      },
    } satisfies Prisma.CartInclude;

    const existingCart = await this.prisma.cart.findUnique({
      where: { userId },
      include: includeClause,
    });

    if (existingCart) return existingCart;

    return this.prisma.cart.create({
      data: { userId },
      include: includeClause,
    });
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    const cart: CartWithItems = await this.getOrCreateCart(userId);

    const existingItem: CartItem | null = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> {
    await this.validateOwnership(userId, cartItemId);

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeItem(userId: string, cartItemId: string): Promise<CartItem> {
    await this.validateOwnership(userId, cartItemId);

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  // Garante que o item pertence ao carrinho do usuário logado
  private async validateOwnership(
    userId: string,
    cartItemId: string,
  ): Promise<void> {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }
  }
}
