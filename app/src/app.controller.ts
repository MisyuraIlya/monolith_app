import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import * as fibonacci from 'fibonacci';
import { MockDataService } from './mock-data/mock-data.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly mockDataService: MockDataService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('seed')
  async seedDb() {
    await this.mockDataService.seedAll(30, 50);
    return 'Database seeded successfully!';
  }


  @Get('fibonacci')
  fibonacciText() {
    this.logger.log('Fibonacci endpoint called');
    return fibonacci.iterate(process.env.FIBONACCI || 3000);
  }

  @Get('liveness')
  livenessCheck() {
    return { status: 'alive' };
  }

  @Get('readiness')
  readinessCheck() {
    // Include checks for dependencies
    const dbHealthy = true; // Example check
    const cacheHealthy = true; // Example check

    if (dbHealthy && cacheHealthy) {
      return { status: 'ready' };
    }
    return { status: 'not ready' };
  }

}
