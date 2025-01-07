import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class MockDataService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async seedUsers(count: number): Promise<void> {
    const users = await Promise.all(
      Array.from({ length: count }).map(async () => ({
        email: faker.internet.email(),
        password: await bcryptjs.hash(faker.internet.password(), 10),
        refreshToken: null,
      })),
    );

    for (const user of users) {
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (!existingUser) {
        await this.userModel.create(user);
      }
    }

    console.log(`${count} users seeded successfully.`);
  }

  async seedProducts(count: number): Promise<void> {
    const products = Array.from({ length: count }).map(() => ({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      sku: faker.string.uuid(),
      isPublished: faker.datatype.boolean(),
    }));

    for (const product of products) {
      const existingProduct = await this.productModel.findOne({ sku: product.sku });
      if (!existingProduct) {
        await this.productModel.create(product);
      }
    }

    console.log(`${count} products seeded successfully.`);
  }

  async seedAll(usersCount: number, productsCount: number): Promise<void> {
    await this.seedUsers(usersCount);
    await this.seedProducts(productsCount);
  }
}
