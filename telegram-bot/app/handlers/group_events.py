from datetime import UTC, datetime

from aiogram import F, Router
from aiogram.types import ChatMemberUpdated, Message
from redis.asyncio import Redis

from app.config import settings
from app.models.payloads import GroupRegistrationPayload, TelegramMessagePayload
from app.security.anonymizer import hash_sender_id
from app.services.backend_client import BackendClient

router = Router(name='group-events')


@router.my_chat_member()
async def handle_bot_added_to_group(event: ChatMemberUpdated, backend: BackendClient, redis: Redis) -> None:
    if event.chat.type not in ('group', 'supergroup'):
        return

    status = event.new_chat_member.status
    if status not in ('administrator', 'member'):
        return

    member_count = None
    key = f'group-register:{event.chat.id}'
    if await redis.set(key, '1', ex=30, nx=True) is None:
        return

    payload = GroupRegistrationPayload(
        telegramGroupId=str(event.chat.id),
        title=event.chat.title or 'Untitled Group',
        memberCount=member_count,
        registeredAt=datetime.now(UTC),
    )
    await backend.post('/telegram/group/register', payload.model_dump(mode='json'))


@router.message(F.chat.type.in_({'group', 'supergroup'}))
async def handle_group_message(message: Message, backend: BackendClient, redis: Redis) -> None:
    if not message.from_user:
        return

    if settings.ignore_forwarded_messages and message.forward_origin:
        return

    dedupe_key = f'message:{message.chat.id}:{message.message_id}'
    if await redis.set(dedupe_key, '1', ex=600, nx=True) is None:
        return

    text_len = len(message.text or message.caption or '')
    payload = TelegramMessagePayload(
        id=f'{message.chat.id}:{message.message_id}',
        telegramGroupId=str(message.chat.id),
        senderHash=hash_sender_id(message.from_user.id, settings.bot_salt),
        messageLength=text_len,
        messageType=resolve_message_type(message),
        createdAt=datetime.fromtimestamp(message.date.timestamp(), tz=UTC),
    )

    await backend.post(
        '/telegram/message/sync',
        payload.model_dump(mode='json'),
        idempotency_key=payload.id,
    )


def resolve_message_type(message: Message) -> str:
    if message.text:
        return 'text'
    if message.photo:
        return 'photo'
    if message.video:
        return 'video'
    if message.voice:
        return 'voice'
    if message.sticker:
        return 'sticker'
    if message.document:
        return 'document'
    if message.audio:
        return 'audio'
    return 'other'
