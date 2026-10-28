import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsUUID, Min } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ example: '11111111-1111-4111-8111-111111111111' })
  @IsUUID()
  filmId: string;

  @ApiProperty({ example: '22222222-2222-4222-8222-222222222222' })
  @IsUUID()
  hallId: string;

  @ApiProperty({
    example: '2099-12-01T18:00:00.000Z',
    description: 'ISO 8601 start time; must be in the future',
  })
  @IsISO8601()
  startsAt: string;

  @ApiProperty({
    example: 12500,
    description: 'Ticket price in the smallest currency unit (kopiyky)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  price: number;
}
