import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = await this.userRepository.save(
        this.userRepository.create({
          email,
          passwordHash: hashed,
          subscriptionPlan: 'free',
        }),
      );
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Password not configured');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_ACCESS_SECRET || 'ravi_access_secret', expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_REFRESH_SECRET || 'ravi_refresh_secret', expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
      },
    };
  }

  refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'ravi_refresh_secret',
      });

      const accessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { secret: process.env.JWT_ACCESS_SECRET || 'ravi_access_secret', expiresIn: '15m' },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
