import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
  ) {}

  async create(dto: CreateEventDto): Promise<EventEntity> {
    if (dto.endDate <= dto.startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const event = this.eventsRepository.create({
      ...dto,
      reservedCount: dto.reservedCount ?? 0,
      isOnline: dto.isOnline ?? false,
      isActive: dto.isActive ?? true,
    });

    return this.eventsRepository.save(event);
  }

  findAll(): Promise<EventEntity[]> {
    return this.eventsRepository.find({
      order: { startDate: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EventEntity> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  getUpcomingActiveEvents(input?: number | { limit?: number }): Promise<EventEntity[]> {
    const requestedLimit = typeof input === 'number' ? input : input?.limit;
    const normalizedLimit = Math.max(20, requestedLimit ?? 20);

    return this.eventsRepository.find({
      where: {
        isActive: true,
        startDate: MoreThan(new Date()),
      },
      order: { startDate: 'ASC' },
      take: normalizedLimit,
    });
  }

  async reserve(eventId: string, userId: string): Promise<EventEntity> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    return this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (!event.isActive) {
        throw new BadRequestException('Event is not active');
      }

      if (event.reservedCount >= event.capacity) {
        throw new BadRequestException('Event is full');
      }

      event.reservedCount += 1;
      await manager.save(event);

      return event;
    });
  }
}
