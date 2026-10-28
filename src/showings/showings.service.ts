import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { BookingsService } from '../bookings/bookings.service';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { ShowingsQueryDto } from './dto/showings-query.dto';
import {
  Showing,
  ShowingSeat,
  ShowingView,
} from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  private readonly showings: Showing[] = [];

  constructor(
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: HallsService,
    @Inject(forwardRef(() => BookingsService))
    private readonly bookingsService: BookingsService,
  ) {}

  create(dto: CreateShowingDto): Showing {
    const film = this.filmsService.findById(dto.filmId);
    if (!film) {
      throw new BadRequestException(
        `Film with id ${dto.filmId} was not found`,
      );
    }

    const hall = this.hallsService.findById(dto.hallId);
    if (!hall) {
      throw new BadRequestException(
        `Hall with id ${dto.hallId} was not found`,
      );
    }

    const startsAtDate = new Date(dto.startsAt);
    if (Number.isNaN(startsAtDate.getTime())) {
      throw new BadRequestException(
        'startsAt must be a valid ISO 8601 date',
      );
    }
    if (startsAtDate.getTime() <= Date.now()) {
      throw new BadRequestException('startsAt cannot be in the past');
    }

    if (!Number.isInteger(dto.price) || dto.price < 1) {
      throw new BadRequestException('price must be a positive integer');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: dto.startsAt,
      price: dto.price,
    };
    this.showings.push(showing);
    return showing;
  }

  findAll(query: ShowingsQueryDto): ShowingView[] {
    let result = [...this.showings];

    if (query.filmId) {
      result = result.filter((showing) => showing.filmId === query.filmId);
    }

    if (query.date) {
      result = result.filter(
        (showing) => this.calendarDate(showing.startsAt) === query.date,
      );
    }

    result.sort((a, b) => {
      const timeDiff =
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      if (timeDiff !== 0) {
        return timeDiff;
      }
      return a.id.localeCompare(b.id);
    });

    return result.map((showing) => this.toView(showing));
  }

  findOne(id: string): ShowingView {
    return this.toView(this.getById(id));
  }

  getById(id: string): Showing {
    const showing = this.showings.find((item) => item.id === id);
    if (!showing) {
      throw new NotFoundException(`Showing with id ${id} was not found`);
    }
    return showing;
  }

  getSeats(id: string): ShowingSeat[] {
    const showing = this.getById(id);
    const hall = this.hallsService.findById(showing.hallId);
    if (!hall) {
      throw new NotFoundException(
        `Hall for showing ${id} was not found`,
      );
    }

    const booked = this.bookingsService.getBookedSeatKeys(id);
    return this.hallsService.listSeats(hall).map((seat) => ({
      row: seat.row,
      seat: seat.seat,
      isBooked: booked.has(`${seat.row}:${seat.seat}`),
    }));
  }

  existsByFilmId(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  existsByHallId(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }

  private toView(showing: Showing): ShowingView {
    const film = this.filmsService.findById(showing.filmId);
    const hall = this.hallsService.findById(showing.hallId);

    return {
      id: showing.id,
      filmTitle: film?.title ?? 'Unknown film',
      hallName: hall?.name ?? 'Unknown hall',
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }

  private calendarDate(startsAt: string): string {
    const match = startsAt.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      return match[1];
    }
    return new Date(startsAt).toISOString().slice(0, 10);
  }
}
