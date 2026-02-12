import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../database/entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async getUserInterests(userId: string): Promise<string[]> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    return profile?.interests ?? [];
  }

  async getProfile(userId: string) {
    const profile = await this.profileRepository.findOne({ where: { userId } });

    return {
      avatarUrl: profile?.avatarUrl ?? null,
      bio: profile?.bio ?? null,
      interests: profile?.interests ?? [],
      city: profile?.city ?? null,
      age: profile?.age ?? null,
      gender: profile?.gender ?? null,
      education: profile?.education ?? null,
    };
  }

  async upsertProfile(userId: string, payload: UpdateProfileDto) {
    const existingProfile = await this.profileRepository.findOne({ where: { userId } });

    const profile = this.profileRepository.create({
      ...(existingProfile ?? {}),
      userId,
      avatarUrl: payload.avatarUrl,
      bio: payload.bio,
      interests: payload.interests?.map((interest) => interest.trim()).filter(Boolean),
      city: payload.city,
      age: payload.age,
      gender: payload.gender?.toLowerCase(),
      education: payload.education,
    });

    const savedProfile = await this.profileRepository.save(profile);

    return {
      id: savedProfile.id,
      avatarUrl: savedProfile.avatarUrl ?? null,
      bio: savedProfile.bio ?? null,
      interests: savedProfile.interests ?? [],
      city: savedProfile.city ?? null,
      age: savedProfile.age ?? null,
      gender: savedProfile.gender ?? null,
      education: savedProfile.education ?? null,
      usage: 'matching_only',
    };
  }
}
