import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { tenantModels } from 'src/providers/tenant-models.provider';

@Module({
  imports: [AuthModule],
  controllers: [BooksController],
  providers: [BooksService,tenantModels.bookModel],
})
export class BooksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   consumer.apply(TenantsMiddleware).forRoutes(BooksController); 
  }
}
