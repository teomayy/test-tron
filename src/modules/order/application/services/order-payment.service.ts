import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order.repository';
import { ICallbackSender } from '../ports/callback-sender.port';

@Injectable()
export class OrderPaymentService {
  private readonly logger = new Logger();

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    @Inject('ICallbackSender')
    private readonly callbackSender: ICallbackSender,
  ) {}

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
    this.logger.log(`Заказ #${order.id} успешно оплачен`);

    if (order.callbackUrl) {
      this.logger.log(
        `Отправка callback для заказа #${order.id} на ${order.callbackUrl}`,
      );
      await this.callbackSender.send(order.callbackUrl, {
        orderId: order.id,
        status: 'paid',
        amountReceived: amount,
      });
    }
  }
}
