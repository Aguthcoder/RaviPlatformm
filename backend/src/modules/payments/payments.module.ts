import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionEntity } from '../../database/entities/subscription.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity, UserEntity]), JwtModule.register({}), NotificationsModule],
  providers: [PaymentsService, JwtAuthGuard],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
