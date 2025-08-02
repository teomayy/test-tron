import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/prisma.module';
import { OrderPaymentService } from './application/services/order-payment.service';
import { OrderPrismaRepository } from './infrastructure/repositories/order.prisma.repository';
import { HttpCallbackSender } from './infrastructure/services/http-callback.service';

@Module({
  imports: [InfraModule, HttpModule],
  providers: [
    OrderPaymentService,
    {
      provide: 'IOrderRepository',
      useClass: OrderPrismaRepository,
    },
    {
      provide: 'ICallbackSender',
      useClass: HttpCallbackSender,
    },
  ],
  exports: [OrderPaymentService],
})
export class OrderModule {}
