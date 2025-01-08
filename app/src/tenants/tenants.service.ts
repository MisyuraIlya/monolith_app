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
    //Verify user does not already exist
    const user = await this.usersService.findOne({email: dto.user.email});
    if (user) {
      throw new BadRequestException('User exists and belongs to a company...');
    }
    console.log('dto',dto)
    //Create a tenant Id
    const tenantId = nanoid(12);
    console.log('tenantId',tenantId)
    //Create a tenant secret
    await this.authService.createSecretKeyForNewTenant(tenantId);
    console.log('tenantId2',tenantId)
    //Create new user
    await this.usersService.create(dto.user, tenantId);

    //Create Tenant Record
    return this.TenantModel.create({
      companyName: dto.companyName,
      tenantId,
    });
  }
}