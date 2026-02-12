import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { MarkNotificationsReadDto } from './dto/mark-notifications-read.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@Req() req: { user: { sub: string } }) {
    const [notifications, unread] = await Promise.all([
      this.notificationsService.listForUser(req.user.sub),
      this.notificationsService.getUnreadCount(req.user.sub),
    ]);

    return {
      unread,
      items: notifications,
    };
  }

  @Post('read')
  async markAsRead(@Req() req: { user: { sub: string } }, @Body() body: MarkNotificationsReadDto) {
    const updated = await this.notificationsService.markAsRead(req.user.sub, body.ids);
    const unread = await this.notificationsService.getUnreadCount(req.user.sub);

    return {
      updated,
      unread,
    };
  }
}
