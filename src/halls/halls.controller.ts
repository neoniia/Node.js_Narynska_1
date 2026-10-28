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
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats } from './entities/hall.entity';
import { HallsService } from './halls.service';

@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a hall' })
  @ApiCreatedResponse({ type: Hall })
  @ApiBadRequestResponse({
    description: 'Missing field, invalid type, or non-positive integer',
  })
  @ApiConflictResponse({ description: 'Hall name is already taken' })
  create(@Body() dto: CreateHallDto): Hall {
    return this.hallsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all halls' })
  @ApiOkResponse({ type: [Hall] })
  findAll(): Hall[] {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hall with its generated seats' })
  @ApiOkResponse({ type: HallWithSeats })
  @ApiNotFoundResponse({ description: 'Hall not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): HallWithSeats {
    return this.hallsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hall' })
  @ApiNoContentResponse({ description: 'Hall deleted' })
  @ApiNotFoundResponse({ description: 'Hall not found' })
  @ApiConflictResponse({
    description: 'Hall is referenced by at least one showing',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.hallsService.remove(id);
  }
}
