import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../token-payload.interface';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class TenantStrategy extends PassportStrategy(Strategy, 'tenant') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Authentication,
      ]),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const { userId, tenantSecret } = payload;
    console.log('tenantSecret',tenantSecret)
    const user = await this.usersService.findOne({ _id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const secretKey = await this.authService.fetchAccessTokenSecretSigningKey(user.tenantId);
    if (secretKey !== tenantSecret) {
      throw new UnauthorizedException('Invalid tenant secret');
    }
    return user;
  }
}
