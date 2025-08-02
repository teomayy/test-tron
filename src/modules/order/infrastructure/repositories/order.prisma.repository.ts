import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma.service';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository';

@Injectable()
export class OrderPrismaRepository implements IOrderRepository {
  private readonly logger = new Logger(OrderPrismaRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async findByAddress(address: string): Promise<Order | null> {
    const orderRecord = await this.prisma.order.findUnique({
      where: { depositAddress: address },
    });

    if (!orderRecord) {
      this.logger.log(`Заказ с адресом ${address} не найден`);
      return null;
    }

    return new Order(
      orderRecord.id,
      orderRecord.status,
      orderRecord.amount.toNumber(),
      orderRecord.callbackUrl ?? undefined,
    );
  }

  async markAsPaid(orderId: number): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid' },
    });
  }
}
