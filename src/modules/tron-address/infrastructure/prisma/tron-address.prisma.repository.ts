import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma.service';
import {
  ITronAddressRepository,
  TronAddressCreateInput,
} from 'src/modules/tron-address/domain/repositories/tron-address.repository';

@Injectable()
export class TronAddressPrismaRepository implements ITronAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: TronAddressCreateInput): Promise<void> {
    await this.prisma.tronDepositAddress.create({
      data,
    });
  }
}
