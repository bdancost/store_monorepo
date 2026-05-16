/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateOrderStatusSchema } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /api/v1/orders — cria pedido do carrinho
  @Post()
  createFromCart(@Req() req: any) {
    return this.ordersService.createFromCart(req.user.sub);
  }

  // GET /api/v1/orders — lista pedidos do usuário
  @Get()
  findAll(@Req() req: any) {
    return this.ordersService.findAllByUser(req.user.sub);
  }

  // GET /api/v1/orders/:id — detalhe do pedido
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.sub, id);
  }

  // PATCH /api/v1/orders/:id/status — atualiza status (admin)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: unknown) {
    const parsed = UpdateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }

    return this.ordersService.updateStatus(
      id,
      parsed.data.status as OrderStatus,
    );
  }

  // PATCH /api/v1/orders/:id/cancel — usuário cancela o próprio pedido
  @Patch(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.cancel(req.user.sub, id);
  }
}
