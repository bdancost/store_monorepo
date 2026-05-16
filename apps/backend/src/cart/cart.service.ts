import { Injectable } from '@nestjs/common';
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

    if (existingCart) {
      return existingCart;
    }

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
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  async updateItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeItem(cartItemId: string): Promise<CartItem> {
    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }
}
