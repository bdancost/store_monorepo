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

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getOrCreateCart(req.user.sub);
  }

  @Post('add')
  addToCart(@Req() req: any, @Body() body: unknown) {
    const parsed = AddToCartSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }

    const { productId, quantity } = parsed.data;
    return this.cartService.addToCart(req.user.sub, productId, quantity);
  }

  @Patch('item/:id')
  updateItem(@Req() req: any, @Param('id') id: string, @Body() body: unknown) {
    const parsed = UpdateCartSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }

    return this.cartService.updateItemQuantity(
      req.user.sub,
      id,
      parsed.data.quantity,
    );
  }

  @Delete('item/:id')
  removeItem(@Req() req: any, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.sub, id);
  }
}
