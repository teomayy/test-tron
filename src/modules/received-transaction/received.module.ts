import { Module } from '@nestjs/common';
import { ReceivedTransactionPrismaRepository } from '../received-transaction/infrastructure/prisma/received-transaction.prisma.repository';

@Module({
  providers: [
    {
      provide: 'IReceivedTransactionRepository',
      useClass: ReceivedTransactionPrismaRepository,
    },
  ],
  exports: ['IReceivedTransactionRepository'],
})
export class ReceivedModule {}
