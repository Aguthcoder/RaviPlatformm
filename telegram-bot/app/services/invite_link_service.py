from datetime import UTC, datetime, timedelta

from aiogram import Bot

from app.config import settings
from app.models.payloads import InviteCreatePayload, InviteUsedPayload
from app.services.backend_client import BackendClient


class InviteLinkService:
    def __init__(self, bot: Bot, backend: BackendClient) -> None:
        self.bot = bot
        self.backend = backend

    async def create_invite(self, telegram_group_id: int, user_id: str) -> str:
        expires_at = datetime.now(UTC) + timedelta(minutes=settings.invite_link_expire_minutes)

        invite = await self.bot.create_chat_invite_link(
            chat_id=telegram_group_id,
            expire_date=expires_at,
            member_limit=1,
            creates_join_request=False,
            name=f'ravi:{user_id}',
        )

        payload = InviteCreatePayload(
            telegramGroupId=str(telegram_group_id),
            userId=user_id,
            expiresAt=expires_at,
            singleUse=True,
        )
        await self.backend.post('/telegram/invite/create', payload.model_dump(mode='json'))

        return invite.invite_link

    async def mark_invite_used(self, telegram_group_id: int, user_id: str, invite_link: str) -> None:
        payload = InviteUsedPayload(
            telegramGroupId=str(telegram_group_id),
            userId=user_id,
            inviteLink=invite_link,
            usedAt=datetime.now(UTC),
        )
        await self.backend.post('/telegram/invite/used', payload.model_dump(mode='json'))
