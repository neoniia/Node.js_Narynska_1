import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
import { FilmsService } from './films.service';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a film' })
  @ApiCreatedResponse({ type: Film, description: 'Film created' })
  @ApiBadRequestResponse({ description: 'Missing or invalid fields' })
  create(@Body() dto: CreateFilmDto): Film {
    return this.filmsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all films' })
  @ApiOkResponse({ type: [Film] })
  findAll(): Film[] {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a film by id' })
  @ApiOkResponse({ type: Film })
  @ApiNotFoundResponse({ description: 'Film not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Film {
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a film' })
  @ApiOkResponse({ type: Film })
  @ApiBadRequestResponse({ description: 'Invalid field type' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateFilmDto,
  ): Film {
    return this.filmsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a film' })
  @ApiNoContentResponse({ description: 'Film deleted' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @ApiConflictResponse({
    description: 'Film is referenced by at least one showing',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.filmsService.remove(id);
  }
}
