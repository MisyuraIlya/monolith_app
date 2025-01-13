import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant } from './entities/tenant.entity';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UsersService } from 'src/users/users.service';
import { nanoid } from 'nanoid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private TenantModel: Model<Tenant>,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async getTenantById(tenantId: string) {
    return this.TenantModel.findOne({ tenantId });
  }

  async createCompany(dto: CreateTenantDto) {
    const user = await this.usersService.findOne({email: dto.user.email});
    if (user) {
      throw new BadRequestException('User exists and belongs to a company...');
    }
    const tenantId = nanoid(12);
    console.log('tenantId',tenantId)
    await this.authService.createSecretKeyForNewTenant(tenantId);
    await this.usersService.create(dto.user, tenantId);
    return this.TenantModel.create({
      companyName: dto.companyName,
      tenantId,
    });
  }
}