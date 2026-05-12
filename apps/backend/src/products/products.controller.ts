import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }
}
