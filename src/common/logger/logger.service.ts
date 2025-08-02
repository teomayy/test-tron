import { Injectable, LoggerService } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LokiLoggerService implements LoggerService {
  private readonly lokiUrl = 'http://loki:3100/loki/api/v1/push';
  private readonly defaultLabels = { job: 'tron-service' };

  log(message: any, context?: string) {
    this.sendToLoki('INFO', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.sendToLoki('ERROR', `${message} ${trace ?? ''}`, context);
  }

  warn(message: any, context?: string) {
    this.sendToLoki('WARN', message, context);
  }

  debug?(message: any, context?: string) {
    this.sendToLoki('DEBUG', message, context);
  }

  private async sendToLoki(level: string, message: string, context?: string) {
    const timestamp = `${BigInt(Date.now()) * 1_000_000n}`;
    const labels = {
      ...this.defaultLabels,
      level,
      ...(context && { context }),
    };

    const payload = {
      streams: [
        {
          stream: labels,
          values: [[timestamp, message]],
        },
      ],
    };

    try {
      await axios.post(this.lokiUrl, payload);
    } catch (err: any) {
      console.error('❌ Failed to send log to Loki:', err.message);
    }
  }
}
