import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EventRecommendationEntity } from '../../database/entities/event-recommendation.entity';
import { GroupMatchEntity } from '../../database/entities/group-match.entity';
import { EventEntity } from '../../database/entities/event.entity';
import { EventsService } from '../events/events.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TelegramService } from '../telegram/telegram.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(EventRecommendationEntity)
    private readonly recommendationRepository: Repository<EventRecommendationEntity>,
    @InjectRepository(GroupMatchEntity)
    private readonly groupMatchRepository: Repository<GroupMatchEntity>,
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly telegramService: TelegramService,
    private readonly integrationsService: IntegrationsService,
    private readonly notificationsService: NotificationsService,
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

  async getGroupMatches(userId: string, limit = 10) {
    const [profile, events] = await Promise.all([
      this.usersService.getProfile(userId),
      this.eventsService.getUpcomingActiveEvents({ limit: Math.max(limit, 20) }),
    ]);

    const results = events
      .map((event) => this.scoreEventForGroupMatch(profile, event))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, Math.min(limit, 50)));

    await Promise.all(
      results.map((result) =>
        this.groupMatchRepository.save({
          userId,
          eventId: result.event.id,
          score: result.score,
          personalityScore: result.breakdown.personality,
          interestsScore: result.breakdown.interests,
          cityScore: result.breakdown.city,
          eventTypeScore: result.breakdown.eventType,
          scoringExplanation: result.explanation,
          scoringBreakdown: result.breakdown,
        }),
      ),
    );

    if (results.length > 0) {
      await this.notificationsService.createNotification({
        userId,
        type: 'match',
        title: 'گروه‌های جدید برای شما پیدا شد',
        body: `${results.length} پیشنهاد جدید آماده است. بالاترین امتیاز: ${results[0].event.title}`,
        metadata: {
          topEventId: results[0].event.id,
          score: results[0].score,
        },
      });
    }

    return {
      userId,
      logic: {
        formula:
          'score = personality(35%) + interests(30%) + city(20%) + eventType(15%), normalized to 0..100',
        weights: {
          personality: 0.35,
          interests: 0.3,
          city: 0.2,
          eventType: 0.15,
        },
        matchingUnit: 'user-to-group/event only',
      },
      results: results.map((result) => ({
        eventId: result.event.id,
        eventTitle: result.event.title,
        eventType: result.event.eventType ?? result.event.category ?? null,
        city: result.event.city ?? null,
        score: result.score,
        breakdown: result.breakdown,
        explanation: result.explanation,
      })),
    };
  }

  private scoreEventForGroupMatch(profile: any, event: EventEntity) {
    const normalized = (items: string[] | null | undefined) =>
      (items ?? []).map((x) => x.toLowerCase().trim()).filter(Boolean);

    const userTraits = normalized(profile.personalityTraits);
    const targetTraits = normalized(event.targetPersonalityTraits);
    const personalityMatches = userTraits.filter((trait) => targetTraits.includes(trait));
    const personality =
      targetTraits.length === 0 || userTraits.length === 0
        ? 0
        : personalityMatches.length / targetTraits.length;

    const userInterests = normalized(profile.interests);
    const eventInterests = normalized([...(event.tags ?? []), event.category ?? '']);
    const interestMatches = userInterests.filter((interest) => eventInterests.includes(interest));
    const interests =
      userInterests.length === 0 || eventInterests.length === 0
        ? 0
        : interestMatches.length / Math.max(userInterests.length, eventInterests.length);

    const city =
      profile.city && event.city
        ? profile.city.toLowerCase().trim() === event.city.toLowerCase().trim()
          ? 1
          : 0
        : 0;

    const preferredTypes = normalized(profile.preferredEventTypes);
    const eventType = preferredTypes.includes((event.eventType ?? '').toLowerCase().trim()) ? 1 : 0;

    const score = Number((personality * 35 + interests * 30 + city * 20 + eventType * 15).toFixed(2));

    return {
      event,
      score,
      breakdown: {
        personality: Number(personality.toFixed(2)),
        interests: Number(interests.toFixed(2)),
        city: Number(city.toFixed(2)),
        eventType: Number(eventType.toFixed(2)),
        matchedTraits: personalityMatches,
        matchedInterests: interestMatches,
      },
      explanation: `Personality ${Math.round(personality * 35)}/35, Interests ${Math.round(
        interests * 30,
      )}/30, City ${Math.round(city * 20)}/20, EventType ${Math.round(eventType * 15)}/15.`,
    };
  }
}
