import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('create-company')
  async createCompany(@Body() createCompanyDto: CreateTenantDto) {
    return this.tenantsService.createCompany(createCompanyDto);
  }
}