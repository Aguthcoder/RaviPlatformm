import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async list(
    @Query('category') category?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const events = await this.eventsService.getUpcomingActiveEvents(category, limit);
    return { count: events.length, events };
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  createBooking(@Req() req: { user: { sub: string } }, @Body() body: CreateBookingDto) {
    return this.eventsService.createBooking(req.user.sub, body.eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/me')
  myBookings(@Req() req: { user: { sub: string } }) {
    return this.eventsService.listMyBookings(req.user.sub);
  }
}
