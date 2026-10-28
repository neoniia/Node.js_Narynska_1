import { ApiProperty } from '@nestjs/swagger';

export class Film {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  releaseYear: number;
}
