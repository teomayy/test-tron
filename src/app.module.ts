import { Module } from '@nestjs/common';
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
  ],
})
export class AppModule {}
