import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type RequestWithUser = {
  headers: Record<string, string | undefined>;
  user?: { sub: string; mobileNumber: string };
};

function extractCookieValue(cookieHeader: string | undefined, key: string) {
  if (!cookieHeader) return null;

  const item = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));

  return item ? decodeURIComponent(item.split('=')[1] ?? '') : null;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const token = extractCookieValue(req.headers.cookie, 'accessToken');

    if (!token) {
      throw new UnauthorizedException('Missing access token cookie');
    }

    try {
      req.user = this.jwtService.verify<{ sub: string; mobileNumber: string }>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'ravi_access_secret',
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
