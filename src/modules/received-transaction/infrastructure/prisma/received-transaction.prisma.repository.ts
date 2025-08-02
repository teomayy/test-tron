import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma.service';
import {
  IReceivedTransactionRepository,
  ReceivedTransactionCreateInput,
} from '../../domain/repositories/received-transaction.repository';

@Injectable()
export class ReceivedTransactionPrismaRepository
  implements IReceivedTransactionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(data: ReceivedTransactionCreateInput): Promise<void> {
    await this.prisma.receivedTransaction.create({ data });
  }

  async exists(txHash: string): Promise<boolean> {
    const tx = await this.prisma.receivedTransaction.findUnique({
      where: { txHash },
    });

    return !!tx;
  }
}
