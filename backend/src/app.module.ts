import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { EventsModule } from './modules/events/events.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
    EventsModule,
    RecommendationsModule,
    TelegramModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
