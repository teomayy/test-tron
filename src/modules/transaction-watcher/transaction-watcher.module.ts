import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PrismaModule } from 'src/infra/prisma.module';
import { OrderModule } from '../order/order.module';
import { ReceivedTransactionPrismaRepository } from '../received-transaction/infrastructure/prisma/received-transaction.prisma.repository';
import { TronAddressPrismaRepository } from '../tron-address/infrastructure/prisma/tron-address.prisma.repository';
import { TronWebService } from '../tron-address/infrastructure/services/tron-web.service';
import { TransactionWatcherService } from './application/transaction-watcher.service';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    HttpModule,
    OrderModule,
    LoggerModule,
  ],
  providers: [
    TronWebService,
    TransactionWatcherService,
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
