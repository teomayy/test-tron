import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infra/prisma.service';

@Injectable()
export class ExpiredAddressCleanerService {
  private readonly logger = new Logger(ExpiredAddressCleanerService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanExpiredAddress(): Promise<void> {
    const result = await this.prisma.tronDepositAddress.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      this.logger.log(`Удалено просроченных адресов: ${result.count}`);
    } else {
      this.logger.log(`Нет просроченных адресов для удаления`);
    }
  }
}
