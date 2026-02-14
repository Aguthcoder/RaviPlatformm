import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from '../../database/entities/event.entity';
import { EventsService } from './events.service';

class ReserveEventDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto): Promise<EventEntity> {
    return this.eventsService.create(dto);
  }

  @Get()
  findAll(): Promise<EventEntity[]> {
    return this.eventsService.findAll();
  }

  @Get('upcoming')
  getUpcoming(@Query('limit') limit?: string): Promise<EventEntity[]> {
    const parsedLimit = Number.parseInt(limit ?? '', 10);
    const safeLimit = Number.isNaN(parsedLimit) ? undefined : parsedLimit;

    return this.eventsService.getUpcomingActiveEvents(safeLimit);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<EventEntity> {
    return this.eventsService.findOne(id);
  }

  @Post(':id/reserve')
  reserve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: ReserveEventDto,
  ): Promise<EventEntity> {
    return this.eventsService.reserve(id, body.userId);
  }
}
