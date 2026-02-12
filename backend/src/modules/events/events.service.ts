import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';

type UpcomingEventsFilter = {
  category?: string;
  limit?: number;
};

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
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
}
