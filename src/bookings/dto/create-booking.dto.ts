import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UniqueSeats } from '../../common/decorators/unique-seats.decorator';
import { SeatDto } from './seat.dto';

export class CreateBookingDto {
  @ApiProperty({ type: [SeatDto], example: [{ row: 1, seat: 1 }] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  @UniqueSeats()
  seats: SeatDto[];
}
