import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats, Seat } from './entities/hall.entity';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateHallDto): Hall {
    const nameTaken = this.halls.some((hall) => hall.name === dto.name);
    if (nameTaken) {
      throw new ConflictException(`Hall with name "${dto.name}" already exists`);
    }

    const hall: Hall = {
      id: randomUUID(),
      name: dto.name,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return [...this.halls];
  }

  findOne(id: string): HallWithSeats {
    const hall = this.findById(id);
    if (!hall) {
      throw new NotFoundException(`Hall with id ${id} was not found`);
    }
    return { ...hall, seats: this.listSeats(hall) };
  }

  findById(id: string): Hall | undefined {
    return this.halls.find((hall) => hall.id === id);
  }

  listSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row += 1) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat += 1) {
        seats.push({ row, seat });
      }
    }
    return seats;
  }

  isSeatInHall(hall: Hall, row: number, seat: number): boolean {
    return (
      Number.isInteger(row) &&
      Number.isInteger(seat) &&
      row >= 1 &&
      seat >= 1 &&
      row <= hall.rows &&
      seat <= hall.seatsPerRow
    );
  }

  remove(id: string): void {
    const index = this.halls.findIndex((hall) => hall.id === id);
    if (index === -1) {
      throw new NotFoundException(`Hall with id ${id} was not found`);
    }
    if (this.showingsService.existsByHallId(id)) {
      throw new ConflictException(
        `Hall with id ${id} cannot be deleted because it is referenced by at least one showing`,
      );
    }
    this.halls.splice(index, 1);
  }
}
