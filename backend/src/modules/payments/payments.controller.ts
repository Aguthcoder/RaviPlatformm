import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
