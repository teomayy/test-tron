import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { OrderModule } from './modules/order/order.module';
import { ReceivedModule } from './modules/received-transaction/received.module';
import { TransactionWatcherModule } from './modules/transaction-watcher/transaction-watcher.module';
import { TronAddressModule } from './modules/tron-address/tron-address.module';

@Module({
  imports: [
    TronAddressModule,
    TransactionWatcherModule,
    ReceivedModule,
    OrderModule,
    LoggerModule,
  ],
})
export class AppModule {}
