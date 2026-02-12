import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

type RequestWithUser = {
  headers: Record<string, string | undefined>;
  user?: { sub: string; mobileNumber?: string; email?: string };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const cookieHeader = req.headers.cookie ?? '';
    const token = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('accessToken='))
      ?.split('=')[1];

    if (!token) throw new UnauthorizedException('Missing access token cookie');

    try {
      req.user = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('JWT_SECRET') ??
          this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
