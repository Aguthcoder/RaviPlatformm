import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: { sub: string; email: string } }>();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      req.user = this.jwtService.verify<{ sub: string; email: string }>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'ravi_access_secret',
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
