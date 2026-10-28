import { ApiProperty } from '@nestjs/swagger';

export class Showing {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  filmId: string;

  @ApiProperty({ format: 'uuid' })
  hallId: string;

  @ApiProperty({ example: '2099-12-01T18:00:00.000Z' })
  startsAt: string;

  @ApiProperty({
    example: 12500,
    description: 'Ticket price in kopiyky',
  })
  price: number;
}

export class ShowingView {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Dune' })
  filmTitle: string;

  @ApiProperty({ example: 'Blue Hall' })
  hallName: string;

  @ApiProperty({ example: '2099-12-01T18:00:00.000Z' })
  startsAt: string;

  @ApiProperty({ example: 12500 })
  price: number;
}

export class ShowingSeat {
  @ApiProperty({ example: 1 })
  row: number;

  @ApiProperty({ example: 1 })
  seat: number;

  @ApiProperty({ example: false })
  isBooked: boolean;
}
