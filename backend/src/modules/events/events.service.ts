import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { EventReservationEntity } from '../../database/entities/event-reservation.entity';
import { TelegramGroupEntity } from '../../database/entities/telegram-group.entity';
import { NotificationsService } from '../notifications/notifications.service';

type UpcomingEventsFilter = {
  category?: string;
  limit?: number;
};

@Injectable()
export class EventsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
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

  async reserve(
    userId: string,
    eventId: string,
    seats: number,
    paymentReference?: string,
  ): Promise<{ reservation: EventReservationEntity; event: EventEntity; remaining: number; telegramInviteLink: string }> {
    const safeSeats = Math.max(1, Math.min(seats, 5));
    const result = await this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.price > 0 && !paymentReference) {
        throw new BadRequestException('Payment is required to reserve this event');
      }

      const existingReservation = await manager.findOne(EventReservationEntity, {
        where: { eventId, userId },
      });
      if (existingReservation) {
        throw new BadRequestException('You already booked this event');
      }

      const remaining = event.capacity - event.reservedCount;
      if (remaining < safeSeats) {
        throw new BadRequestException('Not enough capacity');
      }

      const telegramGroup = await manager.findOne(TelegramGroupEntity, {
        where: { eventId: event.id },
      });
      if (!telegramGroup) {
        throw new BadRequestException('Telegram group is not configured for this event');
      }

      event.reservedCount += safeSeats;
      await manager.save(event);

      const reservation = await manager.save(
        manager.create(EventReservationEntity, {
          userId,
          eventId,
          seats: safeSeats,
          paymentStatus: 'paid',
          paymentReference,
          paidAt: new Date(),
        }),
      );

      return {
        reservation,
        event,
        remaining: event.capacity - event.reservedCount,
        telegramInviteLink: telegramGroup.inviteLink,
      };
    });

    await this.notificationsService.createNotification({
      userId,
      type: 'event',
      title: 'رزرو با موفقیت انجام شد',
      body: `${safeSeats} صندلی برای رویداد «${result.event.title}» رزرو شد.`,
    });

    return result;
  }
}
