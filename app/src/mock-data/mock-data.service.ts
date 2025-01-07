import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

@Injectable()
export class MockDataService {
    generateUsers(count: number) {
        return Array.from({ length: count }).map(() => ({
        //   id: faker.
          name: faker.name.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.address.streetAddress(),
    }));
  }

  generateProducts(count: number) {
    return Array.from({ length: count }).map((_, index) => ({
      id: index + 1,
      title: `Product ${index + 1}`,
      price: Math.round(Math.random() * 1000),
    }));
  }
}
