import { Global, Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './entities/tenant.entity';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';

@Global()
@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
    ]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService, tenantConnectionProvider],
  exports: [TenantsService, tenantConnectionProvider],
})
export class TenantsModule {}
