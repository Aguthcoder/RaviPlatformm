import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../../database/entities/subscription.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async subscribe(userId: string, provider: 'zarinpal' | 'stripe') {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.subscriptionPlan = 'premium';
    await this.userRepository.save(user);

    const subscription = await this.subscriptionRepository.save(
      this.subscriptionRepository.create({
        userId,
        provider,
        plan: 'premium',
        status: 'active',
        amount: 299000,
      }),
    );

    await this.notificationsService.createNotification({
      userId,
      type: 'event',
      title: 'اشتراک ویژه فعال شد',
      body: `پرداخت شما از طریق ${provider} انجام شد و اشتراک ویژه فعال است.`,
    });

    return subscription;
  }
}
