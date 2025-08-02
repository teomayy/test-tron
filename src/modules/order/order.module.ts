import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PrismaModule } from 'src/infra/prisma.module';
import { OrderPaymentService } from './application/services/order-payment.service';
import { OrderPrismaRepository } from './infrastructure/repositories/order.prisma.repository';
import { HttpCallbackSender } from './infrastructure/services/http-callback.service';

@Module({
  imports: [PrismaModule, HttpModule, LoggerModule],
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
  exports: ['IOrderRepository', OrderPaymentService],
})
export class OrderModule {}
