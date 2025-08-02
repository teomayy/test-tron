import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ICallbackSender } from '../../application/ports/callback-sender.port';

@Injectable()
export class HttpCallbackSender implements ICallbackSender {
  constructor(private readonly http: HttpService) {}

  async send(url: string, payload: Record<string, any>): Promise<void> {
    await firstValueFrom(this.http.post(url, payload));
  }
}
