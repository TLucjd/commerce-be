import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    return this.productsService.create(createProductDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body()
    updateProductDto: Partial<
      Pick<Product, 'name' | 'description' | 'price' | 'image'>
    >,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    // Xử lý type conversion cho price
    const processedDto = { ...updateProductDto };
    if (processedDto.price && typeof processedDto.price === 'string') {
      processedDto.price = parseFloat(processedDto.price);
      
      // Validate price after conversion
      if (isNaN(processedDto.price)) {
        throw new Error('Invalid price format');
      }
    }

    // Include file in processedDto as expected by the service
    return this.productsService.update(id, { ...processedDto, file });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Product> {
    return this.productsService.delete(id);
  }
}
