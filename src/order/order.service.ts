import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const total = dto.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return this.prisma.order.create({
      data: {
        userId,
        totalPrice: total,
        status: 'pending',
        items: {
          create: dto.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async getOrdersByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'paid') {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
