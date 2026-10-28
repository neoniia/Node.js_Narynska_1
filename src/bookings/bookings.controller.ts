import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings' })
  @ApiOkResponse({ type: [Booking] })
  findAll(): Booking[] {
    return this.bookingsService.findAll();
  }

  @Post('showings/:id/bookings')
  @ApiOperation({ summary: 'Book seats for a showing' })
  @ApiCreatedResponse({ type: Booking })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  @ApiBadRequestResponse({
    description:
      'Empty seats array, invalid seat, duplicate seat in the request, or seat outside the hall',
  })
  @ApiConflictResponse({
    description: 'At least one requested seat is already booked',
  })
  create(
    @Param('id', new ParseUUIDPipe()) showingId: string,
    @Body() dto: CreateBookingDto,
  ): Booking {
    return this.bookingsService.createForShowing(showingId, dto);
  }

  @Get('showings/:id/bookings')
  @ApiOperation({ summary: 'List bookings of a showing' })
  @ApiOkResponse({ type: [Booking] })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  findByShowing(
    @Param('id', new ParseUUIDPipe()) showingId: string,
  ): Booking[] {
    return this.bookingsService.findByShowing(showingId);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a booking and free its seats' })
  @ApiNoContentResponse({ description: 'Booking cancelled' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.bookingsService.remove(id);
  }
}
