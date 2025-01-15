import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticationToken = req.cookies?.Authentication;
      if (!authenticationToken) {
        throw new UnauthorizedException('Authentication token is missing.');
      }

      const payload = this.jwtService.verify(authenticationToken, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET, 
      });

      const { userId, tenantSecret } = payload;
      if (!userId || !tenantSecret) {
        throw new UnauthorizedException('Invalid token payload.');
      }

      const user = await this.authService.verifyUserTenant(userId, tenantSecret);
      req['tenantId'] = user.tenantId;

      next();
    } catch (err) {
      console.error('Tenant validation error:', err.message);
      throw new UnauthorizedException('Failed to validate tenant.');
    }
  }
}
