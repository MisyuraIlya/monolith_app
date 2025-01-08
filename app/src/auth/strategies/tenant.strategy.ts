import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload.interface';
import { Request } from 'express';

export interface TenantTokenPayload extends TokenPayload {
  tenantId: string;
}

@Injectable()
export class TenantStrategy extends PassportStrategy(Strategy, 'tenant') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Authentication,
      ]),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TenantTokenPayload) {
    const user = await this.authService.verifyUserTenant(payload.userId, payload.tenantId);
    if (!user) {
      throw new UnauthorizedException('Invalid tenant or user.');
    }
    return user;
  }
}
