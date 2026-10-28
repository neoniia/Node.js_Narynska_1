import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      releaseYear: dto.releaseYear,
    };
    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return [...this.films];
  }

  findOne(id: string): Film {
    const film = this.films.find((item) => item.id === id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} was not found`);
    }
    return film;
  }

  findById(id: string): Film | undefined {
    return this.films.find((item) => item.id === id);
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    Object.assign(film, dto);
    return film;
  }

  remove(id: string): void {
    const index = this.films.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Film with id ${id} was not found`);
    }
    if (this.showingsService.existsByFilmId(id)) {
      throw new ConflictException(
        `Film with id ${id} cannot be deleted because it is referenced by at least one showing`,
      );
    }
    this.films.splice(index, 1);
  }
}
