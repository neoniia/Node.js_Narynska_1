import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateShowingDto } from './dto/create-showing.dto';
import { ShowingsQueryDto } from './dto/showings-query.dto';
import {
  Showing,
  ShowingSeat,
  ShowingView,
} from './entities/showing.entity';
import { ShowingsService } from './showings.service';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(private readonly showingsService: ShowingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a showing' })
  @ApiCreatedResponse({ type: Showing })
  @ApiBadRequestResponse({
    description:
      'Unknown film or hall, invalid ISO 8601 startsAt, past startsAt, or invalid price',
  })
  create(@Body() dto: CreateShowingDto): Showing {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List showings with optional film and date filters' })
  @ApiOkResponse({ type: [ShowingView] })
  @ApiBadRequestResponse({ description: 'date is not YYYY-MM-DD' })
  findAll(@Query() query: ShowingsQueryDto): ShowingView[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'List hall seats with booking status for a showing' })
  @ApiOkResponse({ type: [ShowingSeat] })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  getSeats(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): ShowingSeat[] {
    return this.showingsService.getSeats(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showing with film and hall names' })
  @ApiOkResponse({ type: ShowingView })
  @ApiNotFoundResponse({ description: 'Showing not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): ShowingView {
    return this.showingsService.findOne(id);
  }
}
