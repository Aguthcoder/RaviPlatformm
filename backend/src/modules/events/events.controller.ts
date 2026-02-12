import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('upcoming')
  async getUpcoming(
    @Query('category') category?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const events = await this.eventsService.getUpcomingActiveEvents({
      category,
      limit,
    });

    return {
      count: events.length,
      events,
    };
  }
}
