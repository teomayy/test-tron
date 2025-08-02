import { Injectable } from '@nestjs/common';
import { TronWeb } from 'tronweb';

@Injectable()
export class TronWebService {
  private tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: process.env.MASTER_TRON_PRIVATE_KEY,
  });

  async generateAddress(): Promise<{ address: string; privateKey: string }> {
    const account = await this.tronWeb.createAccount();
    return {
      address: account.address.base58,
      privateKey: account.privateKey,
    };
  }

  getTronWeb() {
    return this.tronWeb;
  }
}
