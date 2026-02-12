import {
  BadRequestException,
  Injectable,
  Logger,
  TooManyRequestsException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { MoreThan, Repository } from 'typeorm';
import { OtpCodeEntity } from '../../database/entities/otp-code.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OtpCodeEntity)
    private readonly otpRepository: Repository<OtpCodeEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(mobileNumber: string) {
    const normalizedMobile = this.normalizeIranianMobile(mobileNumber);
    const now = new Date();

    const recentOtp = await this.otpRepository.findOne({
      where: {
        mobileNumber: normalizedMobile,
        createdAt: MoreThan(new Date(now.getTime() - 60 * 1000)),
      },
      order: { createdAt: 'DESC' },
    });

    if (recentOtp) {
      throw new TooManyRequestsException('لطفاً یک دقیقه دیگر دوباره تلاش کنید.');
    }

    const otp = this.generateOtp();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 1000);

    await this.otpRepository.save(
      this.otpRepository.create({
        mobileNumber: normalizedMobile,
        otpHash: this.hashOtp(normalizedMobile, otp),
        expiresAt,
      }),
    );

    this.logger.log(`MVP OTP for ${normalizedMobile}: ${otp}`);

    return {
      message: 'کد تایید ارسال شد.',
      expiresInSeconds: 120,
    };
  }

  async verifyOtp(mobileNumber: string, otp: string) {
    const normalizedMobile = this.normalizeIranianMobile(mobileNumber);

    const otpEntry = await this.otpRepository.findOne({
      where: {
        mobileNumber: normalizedMobile,
        consumedAt: null,
      },
      order: { createdAt: 'DESC' },
    });

    if (!otpEntry) {
      throw new UnauthorizedException('کد تایید معتبر نیست.');
    }

    if (otpEntry.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('زمان کد تایید به پایان رسیده است.');
    }

    if (otpEntry.attempts >= 5) {
      throw new TooManyRequestsException('تعداد تلاش بیش از حد مجاز است.');
    }

    otpEntry.attempts += 1;
    const otpIsValid = otpEntry.otpHash === this.hashOtp(normalizedMobile, otp);

    if (!otpIsValid) {
      await this.otpRepository.save(otpEntry);
      throw new UnauthorizedException('کد تایید اشتباه است.');
    }

    otpEntry.consumedAt = new Date();
    await this.otpRepository.save(otpEntry);

    let user = await this.userRepository.findOne({ where: { mobileNumber: normalizedMobile } });
    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({
          mobileNumber: normalizedMobile,
          subscriptionPlan: 'free',
        }),
      );
    }

    const tokens = this.buildTokens({
      sub: user.id,
      mobileNumber: normalizedMobile,
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        mobileNumber: normalizedMobile,
        subscriptionPlan: user.subscriptionPlan,
      },
    };
  }

  logout() {
    return { message: 'با موفقیت خارج شدید.' };
  }

  private buildTokens(payload: { sub: string; mobileNumber: string }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'ravi_access_secret',
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'ravi_refresh_secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });

    return { accessToken, refreshToken };
  }

  private generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }

  private hashOtp(mobileNumber: string, otp: string) {
    const otpSecret = process.env.OTP_SECRET;
    if (!otpSecret) {
      throw new BadRequestException('OTP_SECRET is not configured');
    }

    return crypto.createHmac('sha256', otpSecret).update(`${mobileNumber}:${otp}`).digest('hex');
  }

  private normalizeIranianMobile(input: string) {
    const digits = input.replace(/\D/g, '');

    if (digits.startsWith('09') && digits.length === 11) {
      return `+98${digits.slice(1)}`;
    }

    if (digits.startsWith('989') && digits.length === 12) {
      return `+${digits}`;
    }

    if (digits.startsWith('9') && digits.length === 10) {
      return `+98${digits}`;
    }

    throw new BadRequestException('شماره موبایل معتبر نیست.');
  }
}
