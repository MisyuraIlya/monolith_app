import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const PORT = 3000
  console.log('MONGODB_URI',process.env.MONGODB_URI)
  console.log('JWT_ACCESS_TOKEN_SECRET',process.env.JWT_ACCESS_TOKEN_SECRET) 
  console.log('JWT_ACCESS_TOKEN_EXPIRATION_MS',process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS)
  console.log('JWT_REFRESH_TOKEN_SECRET',process.env.JWT_REFRESH_TOKEN_SECRET)
  console.log('JWT_REFRESH_TOKEN_EXPIRATION_MS',process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS) 
  console.log('THROTTLE_TTL',process.env.THROTTLE_TTL)
  console.log('THROTTLE_LIMIT',process.env.THROTTLE_LIMIT)
  console.log('REDIS_URI',process.env.REDIS_URI) 
  console.log('REDIS_PORT',process.env.REDIS_PORT)
  console.log('MINIO_ENDPOINT',process.env.MINIO_ENDPOINT) 
  console.log('MINIO_PORT',process.env.MINIO_PORT)
  console.log('MINIO_ACCESS_KEY',process.env.MINIO_ACCESS_KEY) 
  console.log('MINIO_SECRET_KEY',process.env.MINIO_SECRET_KEY)
  console.log('MINIO_BUCKET',process.env.MINIO_BUCKET)

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // Start server
  await app.listen(PORT);
  console.log(`HTTP server started on http://localhost:${PORT}`);
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
}
bootstrap();
