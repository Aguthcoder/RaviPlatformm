import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { EventReservationEntity } from '../../database/entities/event-reservation.entity';
import { SubscriptionEntity } from '../../database/entities/subscription.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { WalletTransactionEntity } from '../../database/entities/wallet-transaction.entity';
import { WalletEntity } from '../../database/entities/wallet.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly walletTransactionRepository: Repository<WalletTransactionEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getWallet(userId: string) {
    const wallet = await this.ensureWallet(userId);
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      currency: wallet.currency,
      updatedAt: wallet.updatedAt,
    };
  }

  async getTransactionHistory(userId: string, limit = 50) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    return this.walletTransactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });
  }

  async rechargeWallet(
    userId: string,
    amount: number,
    gateway: 'zarinpal' | 'idpay' = 'zarinpal',
    callbackUrl?: string,
  ) {
    const normalizedAmount = Math.floor(amount);
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      throw new BadRequestException('Recharge amount must be greater than zero');
    }

    const wallet = await this.ensureWallet(userId);
    const authority = `zp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    const transaction = await this.walletTransactionRepository.save(
      this.walletTransactionRepository.create({
        userId,
        type: 'recharge',
        status: 'pending',
        amount: normalizedAmount,
        balanceAfter: wallet.balance,
        gateway,
        gatewayAuthority: authority,
        callbackUrl,
        description: 'Wallet recharge request',
      }),
    );

    return {
      message: 'Recharge request created. Confirm in gateway callback before balance update.',
      transaction,
      paymentUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
    };
  }

  async payForEvent(userId: string, eventId: string, seats = 1) {
    const safeSeats = Math.max(1, Math.min(Math.floor(seats), 5));

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

      const alreadyPaid = await manager.findOne(EventReservationEntity, {
        where: { userId, eventId },
      });
      if (alreadyPaid) {
        throw new BadRequestException('Event is already paid/booked by this user');
      }

      const wallet = await this.findOrCreateWalletForUpdate(userId, manager);
      const totalAmount = event.price * safeSeats;
      if (wallet.balance < totalAmount) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const remaining = event.capacity - event.reservedCount;
      if (remaining < safeSeats) {
        throw new BadRequestException('Not enough capacity');
      }

      wallet.balance -= totalAmount;
      await manager.save(wallet);

      const paymentReference = `WALLET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
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

      event.reservedCount += safeSeats;
      await manager.save(event);

      const walletTransaction = await manager.save(
        manager.create(WalletTransactionEntity, {
          userId,
          eventId,
          type: 'debit',
          status: 'success',
          amount: totalAmount,
          balanceAfter: wallet.balance,
          gateway: 'wallet',
          description: `Event payment for ${event.title}`,
          metadata: { seats: safeSeats, paymentReference },
        }),
      );

      await this.notificationsService.createNotification({
        userId,
        type: 'event',
        title: 'پرداخت کیف پول انجام شد',
        body: `پرداخت برای «${event.title}» با موفقیت انجام شد.`,
      });

      return {
        reservation,
        transaction: walletTransaction,
        wallet: {
          balance: wallet.balance,
          currency: wallet.currency,
        },
      };
    });
  }

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

  private async ensureWallet(userId: string): Promise<WalletEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentWallet = await this.walletRepository.findOne({ where: { userId } });
    if (currentWallet) {
      return currentWallet;
    }

    return this.walletRepository.save(
      this.walletRepository.create({
        userId,
        balance: 0,
        currency: 'IRR',
      }),
    );
  }

  private async findOrCreateWalletForUpdate(userId: string, manager: EntityManager): Promise<WalletEntity> {
    const user = await manager.findOne(UserEntity, { where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let wallet = await manager.findOne(WalletEntity, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      wallet = manager.create(WalletEntity, { userId, balance: 0, currency: 'IRR' });
      wallet = await manager.save(wallet);
      wallet = await manager.findOne(WalletEntity, {
        where: { id: wallet.id },
        lock: { mode: 'pessimistic_write' },
      });
    }

    return wallet;
  }
}
