import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../database/entities/profile.entity';

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
}
