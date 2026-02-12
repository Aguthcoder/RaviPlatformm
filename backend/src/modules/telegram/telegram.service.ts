import { Injectable, Logger } from '@nestjs/common';
import {
  CreateTelegramInviteDto,
  RegisterTelegramGroupDto,
  SyncTelegramMessageDto,
  UseTelegramInviteDto,
} from './dto';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  async registerGroup(payload: RegisterTelegramGroupDto): Promise<void> {
    this.logger.log(`Group registered: ${payload.telegramGroupId} (${payload.title})`);
  }

  async syncMessage(payload: SyncTelegramMessageDto): Promise<void> {
    this.logger.debug(
      `Message synced group=${payload.telegramGroupId} id=${payload.id} type=${payload.messageType}`,
    );
  }

  async createInvite(payload: CreateTelegramInviteDto): Promise<void> {
    this.logger.log(
      `Invite created for group=${payload.telegramGroupId} userId=${payload.userId} expiresAt=${payload.expiresAt}`,
    );
  }

  async markInviteUsed(payload: UseTelegramInviteDto): Promise<void> {
    this.logger.log(
      `Invite used group=${payload.telegramGroupId} userId=${payload.userId} usedAt=${payload.usedAt}`,
    );
  }

  async getGroupInsights(telegramGroupId: string) {
    return {
      telegramGroupId,
      activityScore: 0,
      dominantTopics: [],
      emotionalTone: 'neutral',
      sampledAt: new Date().toISOString(),
    };
  }

  // Kept for compatibility with existing recommendations flow.
  async getUserKeywordSignals(_userId: string): Promise<string[]> {
    return [];
  }

  // Disabled to satisfy bot policy: no private messaging.
  async sendRecommendations(_userId: string, _events: unknown[] = []): Promise<void> {
    this.logger.warn('sendRecommendations is disabled: Ravi bot works in groups only.');
  }
}
