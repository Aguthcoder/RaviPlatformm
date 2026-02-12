import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateTelegramInviteDto,
  RegisterTelegramGroupDto,
  SyncTelegramMessageDto,
  UseTelegramInviteDto,
} from './dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('group/register')
  async registerGroup(@Body() payload: RegisterTelegramGroupDto) {
    await this.telegramService.registerGroup(payload);
    return { ok: true };
  }

  @Post('message/sync')
  async syncMessage(@Body() payload: SyncTelegramMessageDto) {
    await this.telegramService.syncMessage(payload);
    return { ok: true };
  }

  @Post('invite/create')
  async createInvite(@Body() payload: CreateTelegramInviteDto) {
    await this.telegramService.createInvite(payload);
    return { ok: true };
  }

  @Post('invite/used')
  async markInviteUsed(@Body() payload: UseTelegramInviteDto) {
    await this.telegramService.markInviteUsed(payload);
    return { ok: true };
  }

  @Get('group/insights/:telegramGroupId')
  async getGroupInsights(@Param('telegramGroupId') telegramGroupId: string) {
    return this.telegramService.getGroupInsights(telegramGroupId);
  }
}
