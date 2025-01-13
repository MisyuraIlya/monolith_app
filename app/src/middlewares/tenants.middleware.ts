import {
    Injectable,
    NestMiddleware,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
  import { TenantsService } from 'src/tenants/tenants.service';
  
  @Injectable()
  export class TenantsMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) {}
  
    async use(req: Request, res: Response, next: NextFunction) {
      // console.log('req',req.cookies)
      const tenantSecret = req.cookies?.tenantSecret;
      // console.log('tenantSecret',tenantSecret)
      if (!tenantSecret) {
        throw new UnauthorizedException('Tenant secret is missing in cookies.');
      }
  
      // Validate the tenant secret and fetch the user
      // const user = await this.authService.verifyTenantSecret(tenantSecret);
  
      // if (!user || !user.tenantId) {
      //   throw new UnauthorizedException('Invalid tenant secret or tenant not found.');
      // }
  
      // Attach the tenantId to the request object
      req['tenantId'] = 123;
  
      next();
    }
  }