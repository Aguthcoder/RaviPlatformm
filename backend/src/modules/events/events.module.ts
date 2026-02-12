import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../database/entities/booking.entity';
import { EventEntity } from '../../database/entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([EventEntity, BookingEntity])],
  providers: [JwtAuthGuard, EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
