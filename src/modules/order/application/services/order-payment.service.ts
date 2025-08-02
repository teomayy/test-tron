import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { LokiLoggerService } from 'src/common/logger/logger.service';
import { IOrderRepository } from '../../domain/repositories/order.repository';
import { ICallbackSender } from '../ports/callback-sender.port';

@Injectable()
export class OrderPaymentService implements OnApplicationBootstrap {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    @Inject('ICallbackSender')
    private readonly callbackSender: ICallbackSender,
    private readonly logger: LokiLoggerService,
  ) {}

  onApplicationBootstrap() {
    this.logger.log(
      '🚀 Tron Service fully bootstrapped!',
      'OrderPaymentService',
    );
  }

  async confirmIfPaid(address: string, amount: number): Promise<void> {
    const order = await this.orderRepo.findByAddress(address);
    if (!order) {
      this.logger.warn(`Заказ по адресу ${address} не найден`);
      return;
    }

    if (order.status === 'paid') {
      this.logger.warn(`Заказ #${order.id} уже оплачен`);
      return;
    }

    if (amount < order.amountExpected) {
      this.logger.warn(
        `Получено ${amount}, ожидалось ${order.amountExpected} для заказа #${order.id}`,
      );
      return;
    }

    if (!order.canBePaid(amount)) {
      this.logger.warn(
        `Заказ #${order.id} не может быть оплачен — условие canBePaid()`,
      );
      return;
    }

    await this.orderRepo.markAsPaid(order.id);
    this.logger.log({
      level: 'info',
      message: `Заказ #${order.id} успешно оплачен`,
    });

    if (order.callbackUrl) {
      this.logger.log({
        level: 'info',
        message: `Отправка callback для заказа #${order.id} на ${order.callbackUrl}`,
      });
      await this.callbackSender.send(order.callbackUrl, {
        orderId: order.id,
        status: 'paid',
        amountReceived: amount,
      });
    }
  }
}
