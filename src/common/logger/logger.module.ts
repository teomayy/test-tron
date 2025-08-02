import { Module } from '@nestjs/common';
import { LokiLoggerService } from './logger.service';

@Module({
  providers: [LokiLoggerService],
  exports: [LokiLoggerService],
})
export class LoggerModule {}
