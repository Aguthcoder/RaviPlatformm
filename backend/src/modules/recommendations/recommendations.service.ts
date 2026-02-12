import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EventRecommendationEntity } from '../../database/entities/event-recommendation.entity';
import { EventsService } from '../events/events.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { TelegramService } from '../telegram/telegram.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(EventRecommendationEntity)
    private readonly recommendationRepository: Repository<EventRecommendationEntity>,
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly telegramService: TelegramService,
    private readonly integrationsService: IntegrationsService,
  ) {}

  async generateForUser(userId: string, sendToTelegram = false) {
    const [interests, events, telegramSignals] = await Promise.all([
      this.usersService.getUserInterests(userId),
      this.eventsService.getUpcomingActiveEvents(),
      this.telegramService.getUserKeywordSignals(userId),
    ]);

    const signalSet = new Set([
      ...interests.map((i) => i.toLowerCase()),
      ...telegramSignals.map((s) => s.toLowerCase()),
    ]);

    const ranked = events
      .map((event) => {
        const tags = event.tags ?? [];
        const haystack = [event.title, event.description, event.category, ...tags]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const score = Array.from(signalSet).reduce(
          (acc, signal) => (haystack.includes(signal) ? acc + 1 : acc),
          0,
        );

        return {
          event,
          score,
          source: telegramSignals.length > 0 ? 'hybrid' : 'dashboard',
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const persisted = await Promise.all(
      ranked.map((item) =>
        this.recommendationRepository.save({
          userId,
          eventId: item.event.id,
          score: item.score,
          recommendationSource: item.source,
          reason: `Matched signals: ${Array.from(signalSet).join(', ')}`,
          isSentToTelegram: false,
        }),
      ),
    );

    if (sendToTelegram && persisted.length > 0) {
      await this.telegramService.sendRecommendations(userId, ranked.map((r) => r.event));
      await this.recommendationRepository.update(
        { id: In(persisted.map((p) => p.id)) },
        { isSentToTelegram: true },
      );
    }

    await this.integrationsService.pushRecommendationsToN8n(userId, ranked);
    return ranked;
  }
}
