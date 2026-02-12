import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async createNotification(input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
  }): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create(input);
    return this.notificationRepository.save(notification);
  }

  async markAsRead(userId: string, notificationIds?: string[]): Promise<number> {
    const where =
      notificationIds && notificationIds.length > 0
        ? { userId, isRead: false, id: In(notificationIds) }
        : { userId, isRead: false };

    const result = await this.notificationRepository.update(where, {
      isRead: true,
      readAt: new Date(),
    });

    return result.affected ?? 0;
  }
}
