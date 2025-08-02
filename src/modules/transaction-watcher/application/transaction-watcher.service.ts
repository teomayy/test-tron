import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infra/prisma.service';
import { OrderPaymentService } from 'src/modules/order/application/services/order-payment.service';
import { IReceivedTransactionRepository } from 'src/modules/received-transaction/domain/repositories/received-transaction.repository';
import { TronWebService } from 'src/modules/tron-address/infrastructure/services/tron-web.service';

const USDT_CONTRACT = process.env.USDT_CONTRACT!;

interface TransferEvent {
  transaction_id: string;
  result: {
    from: string;
    to: string;
    value: string;
  };
}

@Injectable()
export class TransactionWatcherService implements OnModuleInit {
  private readonly logger = new Logger(TransactionWatcherService.name);
  private contract: any;

  constructor(
    private readonly tronWeb: TronWebService,
    private readonly prisma: PrismaService,
    @Inject('IReceivedTransactionRepository')
    private readonly receivedTxRepo: IReceivedTransactionRepository,
    private readonly orderPaymentService: OrderPaymentService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const tron = this.tronWeb.getTronWeb();
      this.contract = await tron.contract().at(USDT_CONTRACT);
      this.logger.log('Контракт USDT инициализирован');
    } catch (error) {
      this.logger.log(`Ошибка инициализации контракта: ${error}`);
    }
  }

  async scan(): Promise<void> {
    const tronWeb = this.tronWeb.getTronWeb();

    this.logger.log('Начат скан блоков');

    const activeAddresses = await this.prisma.tronDepositAddress.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    const addressSet = new Set(activeAddresses.map((a) => a.address));

    // Получаем последние N блоков (можно вынести в конфиг)
    const currentBlock = await tronWeb.trx.getCurrentBlock();
    const startBlock = currentBlock.block_header.raw_data.number - 200;
    const endBlock = currentBlock.block_header.raw_data.number;

    this.logger.log(`Сканируем блоки с ${startBlock} по ${endBlock}`);

    for (let i = startBlock; i <= endBlock; i++) {
      try {
        const rawEvents = await tronWeb.getEventResult(USDT_CONTRACT, {
          eventName: 'Transfer',
          blockNumber: i,
        });

        const events = Array.isArray(rawEvents) ? rawEvents : [];

        this.logger.log(`🔹 Блок ${i}: найдено ${events.length} событий`);

        for (const event of events as TransferEvent[]) {
          const txHash = event.transaction_id;
          const from = `T${tronWeb.address.fromHex(event.result.from)}`;
          const to = `T${tronWeb.address.fromHex(event.result.to)}`;
          const amount = Number(event.result.value) / 1e6;

          if (!addressSet.has(to)) {
            this.logger.log(`Адрес ${to} не отслеживается`);
            continue;
          }

          const exists = await this.receivedTxRepo.exists(txHash);
          if (exists) {
            this.logger.log(`Транзакция ${txHash} уже сохранена`);
            continue;
          }

          await this.receivedTxRepo.save({
            txHash,
            tronAddress: to,
            sender: from,
            amount,
            confirmed: true,
          });
          this.logger.log(
            `Получен платеж на ${to} от ${from} на сумму ${amount} USDT`,
          );

          await this.orderPaymentService.confirmIfPaid(to, amount);
        }
      } catch (error) {
        this.logger.log(`Ошибка при обработке блока ${i}: ${error}`);
      }
    }
    this.logger.log(`Завершено сканирование блоков`);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log(`Запуск cron-задачи сканирования блоков`);
    await this.scan();
  }
}
