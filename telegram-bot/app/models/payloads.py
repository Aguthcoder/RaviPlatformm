from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class GroupRegistrationPayload(BaseModel):
    telegramGroupId: str
    title: str
    memberCount: int | None
    registeredAt: datetime


class TelegramMessagePayload(BaseModel):
    id: str
    telegramGroupId: str
    senderHash: str
    messageLength: int
    messageType: Literal['text', 'photo', 'video', 'voice', 'sticker', 'document', 'audio', 'other']
    createdAt: datetime


class InviteCreatePayload(BaseModel):
    telegramGroupId: str
    userId: str
    expiresAt: datetime
    singleUse: bool = True


class InviteUsedPayload(BaseModel):
    telegramGroupId: str
    userId: str
    inviteLink: str
    usedAt: datetime
