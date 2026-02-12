import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { EventEntity } from '../../database/entities/event.entity';
import { EventReservationEntity } from '../../database/entities/event-reservation.entity';
import { TelegramGroupEntity } from '../../database/entities/telegram-group.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, EventReservationEntity, TelegramGroupEntity]),
    JwtModule.register({}),
    NotificationsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtAuthGuard],
  exports: [EventsService],
})
export class EventsModule {}
