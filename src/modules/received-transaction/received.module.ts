import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PrismaModule } from 'src/infra/prisma.module';
import { ReceivedTransactionPrismaRepository } from '../received-transaction/infrastructure/prisma/received-transaction.prisma.repository';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [
    {
      provide: 'IReceivedTransactionRepository',
      useClass: ReceivedTransactionPrismaRepository,
    },
  ],
  exports: ['IReceivedTransactionRepository'],
})
export class ReceivedModule {}
