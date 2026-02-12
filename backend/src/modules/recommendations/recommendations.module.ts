import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRecommendationEntity } from '../../database/entities/event-recommendation.entity';
import { IntegrationsModule } from '../integrations/integrations.module';
import { EventsModule } from '../events/events.module';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRecommendationEntity]),
    UsersModule,
    EventsModule,
    TelegramModule,
    IntegrationsModule,
  ],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
