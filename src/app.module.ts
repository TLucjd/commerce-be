import { Module, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [PrismaModule, ProductsModule, UploadModule, AuthModule, OrderModule],
})
export class AppModule {}
