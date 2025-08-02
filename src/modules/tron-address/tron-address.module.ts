import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PrismaModule } from 'src/infra/prisma.module';
import { GenerateAddressHandler } from './application/handlers/generate-address.handler';
import { ExpiredAddressCleanerService } from './application/services/expired-address-cleaner.service';
import { TronAddressPrismaRepository } from './infrastructure/prisma/tron-address.prisma.repository';
import { TronWebService } from './infrastructure/services/tron-web.service';
import { TronAddressController } from './interfaces/controllers/tron-address.controllers';

@Module({
  imports: [CqrsModule, PrismaModule, LoggerModule],
  providers: [
    TronWebService,
    GenerateAddressHandler,
    ExpiredAddressCleanerService,
    {
      provide: 'ITronAddressRepository',
      useClass: TronAddressPrismaRepository,
    },
  ],
  controllers: [TronAddressController],
})
export class TronAddressModule {}
