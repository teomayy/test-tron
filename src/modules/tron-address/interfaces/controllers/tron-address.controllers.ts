import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateAddressCommand } from 'src/modules/tron-address/application/commands/generate-address.command';
import { GenerateTronAddressDto } from 'src/modules/tron-address/application/dto/generate-tron-address.dto';
import { GeneratedAddressDto } from 'src/modules/tron-address/application/dto/generated-address.dto';

@Controller('tron-address')
export class TronAddressController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async generate(
    @Body() dto: GenerateTronAddressDto,
  ): Promise<GeneratedAddressDto> {
    return this.commandBus.execute(
      new GenerateAddressCommand(dto.orderId, dto.userId, dto.ttlMinutes ?? 0),
    );
  }
}
