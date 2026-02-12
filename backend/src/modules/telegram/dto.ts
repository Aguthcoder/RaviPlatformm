import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RegisterTelegramGroupDto {
  @IsString()
  telegramGroupId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  memberCount?: number | null;

  @IsDateString()
  registeredAt!: string;
}

export class SyncTelegramMessageDto {
  @IsString()
  id!: string;

  @IsString()
  telegramGroupId!: string;

  @IsString()
  senderHash!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(4096)
  messageLength!: number;

  @IsIn(['text', 'photo', 'video', 'voice', 'sticker', 'document', 'audio', 'other'])
  messageType!: string;

  @IsDateString()
  createdAt!: string;
}

export class CreateTelegramInviteDto {
  @IsString()
  telegramGroupId!: string;

  @IsString()
  userId!: string;

  @IsDateString()
  expiresAt!: string;

  @IsBoolean()
  singleUse!: boolean;
}

export class UseTelegramInviteDto {
  @IsString()
  telegramGroupId!: string;

  @IsString()
  userId!: string;

  @IsString()
  inviteLink!: string;

  @IsDateString()
  usedAt!: string;
}
