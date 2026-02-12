import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BookingEntity } from '../../database/entities/booking.entity';
import { EventEntity } from '../../database/entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async getUpcomingActiveEvents(category?: string, limit = 50): Promise<EventEntity[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .where('event.is_active = true')
      .andWhere('event.start_date > NOW()')
      .orderBy('event.start_date', 'ASC')
      .limit(Math.max(1, Math.min(limit, 100)));

    if (category) query.andWhere('event.category = :category', { category });
    return query.getMany();
  }

  async createBooking(userId: string, eventId: string): Promise<BookingEntity> {
    return this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) throw new NotFoundException('Event not found');
      if (!event.isActive) throw new BadRequestException('Event is inactive');
      if (event.reservedCount >= event.capacity) throw new BadRequestException('Event capacity reached');

      const existing = await manager.findOne(BookingEntity, {
        where: { eventId, userId },
      });
      if (existing) throw new BadRequestException('User already has booking for this event');

      event.reservedCount += 1;
      await manager.save(event);

      return manager.save(
        manager.create(BookingEntity, {
          eventId,
          userId,
          status: event.price > 0 ? 'pending' : 'confirmed',
          paymentStatus: event.price > 0 ? 'unpaid' : 'paid',
          amountPaid: event.price > 0 ? undefined : '0',
          confirmedAt: event.price > 0 ? undefined : new Date(),
          bookingCode: `RV-${Date.now().toString(36).toUpperCase()}`,
        }),
      );
    });
  }

  listMyBookings(userId: string) {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }
}
