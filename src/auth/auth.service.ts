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
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private readonly usersService: UsersService,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService
    ){}

    async login(
      user: User,
      response: Response
    ) {
      const expiresAccessToken = new Date()
      expiresAccessToken.setMilliseconds(
        expiresAccessToken.getTime() + parseInt(
          this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')
        )
      )

      const expiresRefreshToken = new Date()
      expiresRefreshToken.setMilliseconds(
        expiresRefreshToken.getTime() + parseInt(
          this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS')
        )
      )


      const tokenPayload: TokenPayload = {
        userId: user._id.toHexString(),
      }

      const accessToken = this.jwtService.sign(
        tokenPayload,
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${
            this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')
          }ms`
        }
      )

      const refreshToken = this.jwtService.sign(tokenPayload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${
          this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS')
        }ms`
      })

      await this.usersService.update(
        {_id: user._id},
        {$set: { refreshToken:await bcrypt.hash(refreshToken, 10)}}
      )

      response.cookie('Authentication', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresAccessToken
      }) 

      response.cookie('Refresh', refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresRefreshToken
      }) 

    }

    async verifyUser(email: string, password: string) {
      try {
        const user = await this.usersService.findOne({
          email
        })
        const authenticated = await compare(password, user.password)
        if(!authenticated){
          throw new UnauthorizedException();
        }
        return user
      } catch(err) {
        throw new UnauthorizedException('Credentials are not valid')
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
}
