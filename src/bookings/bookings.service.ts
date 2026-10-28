import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { HallsService } from '../halls/halls.service';
import { ShowingsService } from '../showings/showings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: HallsService,
  ) {}

  findAll(): Booking[] {
    return [...this.bookings];
  }

  createForShowing(showingId: string, dto: CreateBookingDto): Booking {
    const showing = this.showingsService.getById(showingId);
    const hall = this.hallsService.findById(showing.hallId);
    if (!hall) {
      throw new BadRequestException(
        `Hall for showing ${showingId} was not found`,
      );
    }

    for (const place of dto.seats) {
      if (!this.hallsService.isSeatInHall(hall, place.row, place.seat)) {
        throw new BadRequestException(
          `Seat row ${place.row} seat ${place.seat} does not exist in hall "${hall.name}"`,
        );
      }
    }

    const booked = this.getBookedSeatKeys(showingId);
    const conflict = dto.seats.find((place) =>
      booked.has(`${place.row}:${place.seat}`),
    );
    if (conflict) {
      throw new ConflictException(
        `Seat row ${conflict.row} seat ${conflict.seat} is already booked for this showing`,
      );
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats: dto.seats.map((place) => ({ row: place.row, seat: place.seat })),
      totalPrice: showing.price * dto.seats.length,
    };
    this.bookings.push(booking);
    return booking;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.getById(showingId);
    return this.bookings.filter((booking) => booking.showingId === showingId);
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      throw new NotFoundException(`Booking with id ${id} was not found`);
    }
    this.bookings.splice(index, 1);
  }

  getBookedSeatKeys(showingId: string): Set<string> {
    const keys = new Set<string>();
    for (const booking of this.bookings) {
      if (booking.showingId !== showingId) {
        continue;
      }
      for (const place of booking.seats) {
        keys.add(`${place.row}:${place.seat}`);
      }
    }
    return keys;
  }
}
