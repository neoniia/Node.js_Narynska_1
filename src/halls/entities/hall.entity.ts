import { ApiProperty } from '@nestjs/swagger';

export class Seat {
  @ApiProperty({ example: 1 })
  row: number;

  @ApiProperty({ example: 1 })
  seat: number;
}

export class Hall {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rows: number;

  @ApiProperty()
  seatsPerRow: number;
}

export class HallWithSeats extends Hall {
  @ApiProperty({ type: [Seat] })
  seats: Seat[];
}
