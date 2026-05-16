/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AddToCartSchema } from './dto/create-cart.dto';
import { UpdateCartSchema } from './dto/update-cart.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Rota para ver o carrinho: GET /api/cart
  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getOrCreateCart(req.user.sub);
  }

  // Rota para adicionar item: POST /api/cart/add
  @Post('add')
  addToCart(@Req() req: any, @Body() body: unknown) {
    const parsed = AddToCartSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }

    const { productId, quantity } = parsed.data;
    return this.cartService.addToCart(req.user.sub, productId, quantity);
  }

  // PATCH /api/cart/item/:id
  @Patch('item/:id')
  updateItem(@Param('id') id: string, @Body() body: unknown) {
    const parsed = UpdateCartSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }

    return this.cartService.updateItemQuantity(id, parsed.data.quantity);
  }

  // Rota para deletar um item: DELETE /api/cart/item/:id
  @Delete('item/:id')
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }
}
