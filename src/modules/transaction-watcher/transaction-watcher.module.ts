import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InfraModule } from 'src/infra/prisma.module';
import { OrderPaymentService } from '../order/application/services/order-payment.service';
import { ReceivedTransactionPrismaRepository } from '../received-transaction/infrastructure/prisma/received-transaction.prisma.repository';
import { TronAddressPrismaRepository } from '../tron-address/infrastructure/prisma/tron-address.prisma.repository';
import { TronWebService } from '../tron-address/infrastructure/services/tron-web.service';
import { TransactionWatcherService } from './application/transaction-watcher.service';

@Module({
  imports: [InfraModule, ScheduleModule.forRoot(), HttpModule],
  providers: [
    TronWebService,
    TransactionWatcherService,
    OrderPaymentService,
    {
      provide: 'ITronAddressRepository',
      useClass: TronAddressPrismaRepository,
    },
    {
      provide: 'IReceivedTransactionRepository',
      useClass: ReceivedTransactionPrismaRepository,
    },
  ],
})
export class TransactionWatcherModule {}
