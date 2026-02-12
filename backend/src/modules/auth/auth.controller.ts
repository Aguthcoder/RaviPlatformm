import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

function extractRefreshToken(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;

  const item = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('refreshToken='));

  return item ? decodeURIComponent(item.split('=')[1] ?? '') : null;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(body.email, body.password);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: data.accessToken,
      user: data.user,
    };
  }

  @Post('refresh')
  refresh(@Req() req: { headers: { cookie?: string } }) {
    const refreshToken = extractRefreshToken(req.headers.cookie);

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token cookie found');
    }

    return this.authService.refresh(refreshToken);
  }
}
