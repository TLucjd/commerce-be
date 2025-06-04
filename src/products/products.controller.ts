import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto: Pick<Product, 'name' | 'description' | 'price'> & Partial<Pick<Product, 'image'>>): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.delete(id);
  }
}
