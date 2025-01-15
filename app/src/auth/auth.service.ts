import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';
import * as bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';
import { TenantConnectionService } from 'src/services/tenant-connection.service';
import { Secrets, SecretsSchema } from './entities/secrets.entity';
import { jwt } from 'twilio';
import { decrypt } from 'src/utils/decrypt';
import { encrypt } from 'src/utils/encrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async login(user: User, response: Response) {

    const expiresAccessToken = new Date();

    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const secretKey = await this.fetchAccessTokenSecretSigningKey(user.tenantId);

    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
      tenantSecret: secretKey
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    await this.usersService.update(
      { _id: user._id },
      { $set: { refreshToken: await bcryptjs.hash(refreshToken, 10) } },
    );

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOne({
        email,
      });
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async veryifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.usersService.findOne({ _id: userId });
      const authenticated = await compare(refreshToken, user.refreshToken);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }


  // FOR MULTI-TENANCY
  async createSecretKeyForNewTenant(tenantId: string) {
    //Generate Random Secret Key
    const jwtSecret = nanoid(128);

    //Encrypt the Secret Key
    const encryptedSecret = encrypt(
      jwtSecret,
      this.configService.get(`JWT_ACCESS_TOKEN_SECRET`),
    );

    //Get Access to the tenant specific Model
    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );

    //Store the encrypted secret key
    await SecretsModel.create({ jwtSecret: encryptedSecret });
  }

  async fetchAccessTokenSecretSigningKey(tenantId: string) {
    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      { name: Secrets.name, schema: SecretsSchema },
      tenantId,
    );
  
    const secretsDoc = await SecretsModel.findOne();
    if (!secretsDoc) {
      throw new UnauthorizedException('No secret found for this tenant.');
    }
  
    return decrypt(secretsDoc.jwtSecret, this.configService.get(`JWT_ACCESS_TOKEN_SECRET`));
  }

  async verifyUserTenant(userId: string, tenantSecret: string) {
    const user = await this.usersService.findOne({ _id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
  
    // Fetch the tenant's secret key
    const storedTenantSecret = await this.fetchAccessTokenSecretSigningKey(user.tenantId);
    if (storedTenantSecret !== tenantSecret) {
      throw new UnauthorizedException('Invalid tenant secret.');
    }
  
    return user; // Return user if validation passes
  }

}
