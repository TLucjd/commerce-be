import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.sub, dto);
  }

  @Get('me')
  async getMyOrders(@Req() req) {
    return this.orderService.getOrdersByUser(req.user.sub);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'paid',
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
