import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
