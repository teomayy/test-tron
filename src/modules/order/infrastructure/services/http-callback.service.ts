import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { ICallbackSender } from '../../application/ports/callback-sender.port';

@Injectable()
export class HttpCallbackSender implements ICallbackSender {
  private readonly logger = new Logger(HttpCallbackSender.name);
  constructor(private readonly http: HttpService) {}

  async send(url: string, payload: Record<string, any>): Promise<void> {
    try {
      await firstValueFrom(this.http.post(url, payload));
      this.logger.log(`Callback отправлен на ${url}`);
    } catch (error) {
      this.logger.log(`Ошибка отправки callback на ${url}: ${error}`);
    }
  }
}
