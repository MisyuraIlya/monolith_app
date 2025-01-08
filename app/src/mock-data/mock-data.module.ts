import { Module } from '@nestjs/common';
import { MockDataService } from './mock-data.service';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
    imports: [
        UsersModule, 
        ProductsModule,
    ],
    providers: [MockDataService],
    exports: [MockDataService],
})
export class MockDataModule {}
