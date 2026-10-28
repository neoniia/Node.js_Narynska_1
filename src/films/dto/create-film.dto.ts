import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'Dune' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 155, description: 'Duration in minutes' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsInt()
  releaseYear: number;
}
