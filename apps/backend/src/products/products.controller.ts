import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  UpdateProductDto,
  UpdateProductSchema,
} from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards() // Aqui você pode adicionar o AuthGuard se quiser proteger as rotas
  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
