import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { EventReservationEntity } from '../../database/entities/event-reservation.entity';
import { NotificationsService } from '../notifications/notifications.service';

type UpcomingEventsFilter = {
  category?: string;
  limit?: number;
};

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(EventReservationEntity)
    private readonly reservationRepository: Repository<EventReservationEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUpcomingActiveEvents(filter: UpcomingEventsFilter = {}): Promise<EventEntity[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .where('event.is_active = :isActive', { isActive: true })
      .andWhere('event.start_date > NOW()')
      .orderBy('event.start_date', 'ASC');

    if (filter.category) {
      query.andWhere('event.category = :category', { category: filter.category });
    }

    const safeLimit = Math.min(Math.max(filter.limit ?? 50, 1), 100);
    query.limit(safeLimit);

    return query.getMany();
  }

  async reserve(userId: string, eventId: string, seats: number) {
    const safeSeats = Math.max(1, Math.min(seats, 5));
    const event = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const remaining = event.capacity - event.reservedCount;
    if (remaining < safeSeats) {
      throw new BadRequestException('Not enough capacity');
    }

    event.reservedCount += safeSeats;
    await this.eventRepository.save(event);

    const reservation = await this.reservationRepository.save(
      this.reservationRepository.create({
        userId,
        eventId,
        seats: safeSeats,
      }),
    );

    await this.notificationsService.createNotification({
      userId,
      type: 'event',
      title: 'رزرو با موفقیت انجام شد',
      body: `${safeSeats} صندلی برای رویداد «${event.title}» رزرو شد.`,
    });

    return {
      reservation,
      event,
      remaining: event.capacity - event.reservedCount,
    };
  }
}
