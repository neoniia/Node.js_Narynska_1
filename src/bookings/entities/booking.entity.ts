import { ApiProperty } from '@nestjs/swagger';

export class BookingSeat {
  @ApiProperty({ example: 1 })
  row: number;

  @ApiProperty({ example: 1 })
  seat: number;
}

export class Booking {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  showingId: string;

  @ApiProperty({ type: [BookingSeat] })
  seats: BookingSeat[];

  @ApiProperty({
    example: 25000,
    description: 'Showing price multiplied by the number of seats, in kopiyky',
  })
  totalPrice: number;
}
