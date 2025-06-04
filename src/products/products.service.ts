import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  create(data: Pick<Product, 'name' | 'description' | 'price'> & Partial<Pick<Product, 'image'>>): Promise<Product> {
    return this.prisma.product.create({ 
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
     });
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
