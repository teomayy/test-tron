import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GenerateTronAddressDto {
  @ApiProperty()
  @IsInt()
  orderId!: number;

  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiPropertyOptional({ minimum: 15 })
  @IsOptional()
  @IsInt()
  @Min(15)
  ttlMinutes?: number;
}
