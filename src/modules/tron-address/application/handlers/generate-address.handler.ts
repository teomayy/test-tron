import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { addMinutes } from 'date-fns';
import { ITronAddressRepository } from 'src/modules/tron-address/domain/repositories/tron-address.repository';
import { TronWebService } from 'src/modules/tron-address/infrastructure/services/tron-web.service';
import { GenerateAddressCommand } from '../commands/generate-address.command';
import { GeneratedAddressDto } from '../dto/generated-address.dto';

@CommandHandler(GenerateAddressCommand)
export class GenerateAddressHandler
  implements ICommandHandler<GenerateAddressCommand>
{
  constructor(
    private readonly tronWeb: TronWebService,
    @Inject('ITronAddressRepository')
    private readonly repo: ITronAddressRepository,
  ) {}

  async execute(command: GenerateAddressCommand): Promise<GeneratedAddressDto> {
    const { address, privateKey } = await this.tronWeb.generateAddress();
    const expiresAt = addMinutes(new Date(), command.ttlMinutes);

    await this.repo.save({
      orderId: command.orderId,
      userId: command.userId,
      address,
      privateKey,
      expiresAt,
    });

    return new GeneratedAddressDto(address, expiresAt);
  }
}
