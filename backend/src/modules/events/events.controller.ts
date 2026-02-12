import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async list(
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

  @Post('reserve')
  @UseGuards(JwtAuthGuard)
  async reserve(
    @Req() req: { user: { sub: string } },
    @Body() body: { eventId: string; seats?: number; paymentReference?: string },
  ) {
    return this.eventsService.reserve(req.user.sub, body.eventId, body.seats ?? 1, body.paymentReference);
  }
}
