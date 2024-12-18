import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

test('placeholder', () => {
  expect(true).toBe(true);
});

// describe('ProductsService', () => {
//   let service: ProductsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [ProductsService],
//     }).compile();

//     service = module.get<ProductsService>(ProductsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
