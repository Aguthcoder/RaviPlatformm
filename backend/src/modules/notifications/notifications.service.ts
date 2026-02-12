import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity, NotificationType } from '../../database/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async listForUser(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 30,
    });
  }

  async createNotification(input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
  }): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create(input);
    return this.notificationRepository.save(notification);
  }
}
