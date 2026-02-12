import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { UserEntity } from '../../database/entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Get('subscriptions/me')
  async mySubscription(@Req() req: { user: { sub: string } }) {
    const user = await this.userRepository.findOne({ where: { id: req.user.sub } });
    return {
      plan: user?.subscriptionPlan ?? 'free',
      features: user?.subscriptionPlan === 'premium' ? ['priority_events', 'unlimited_matches'] : ['basic_events'],
    };
  }

  @Get('wallet')
  async wallet(@Req() req: { user: { sub: string } }) {
    return this.paymentsService.getWallet(req.user.sub);
  }

  @Get('wallet/transactions')
  async history(@Req() req: { user: { sub: string } }, @Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 50;
    return this.paymentsService.getTransactionHistory(req.user.sub, parsed);
  }

  @Post('wallet/recharge')
  async recharge(
    @Req() req: { user: { sub: string } },
    @Body() body: { amount: number; gateway?: 'zarinpal' | 'idpay'; callbackUrl?: string },
  ) {
    return this.paymentsService.rechargeWallet(req.user.sub, body.amount, body.gateway, body.callbackUrl);
  }

  @Post('wallet/pay')
  async pay(
    @Req() req: { user: { sub: string } },
    @Body() body: { eventId: string; seats?: number },
  ) {
    return this.paymentsService.payForEvent(req.user.sub, body.eventId, body.seats ?? 1);
  }

  @Post('payments/subscribe')
  async subscribe(
    @Req() req: { user: { sub: string } },
    @Body() body: { provider?: 'zarinpal' | 'stripe' },
  ) {
    const provider = body.provider ?? 'stripe';
    const subscription = await this.paymentsService.subscribe(req.user.sub, provider);

    return {
      status: 'success',
      subscription,
      redirectUrl: provider === 'zarinpal' ? 'https://www.zarinpal.com' : 'https://dashboard.stripe.com',
    };
  }
}
