import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductsModule } from './products/products.module';
import {PrometheusModule} from '@willsoto/nestjs-prometheus'
import { LoggingInterceptor } from './logging.interceptor';
@Module({
  imports: [

    // ENV
    ConfigModule.forRoot({ isGlobal: true }),

    // MONGO
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // CACHE
    // CacheModule.registerAsync({
    //   imports: [ConfigModule], 
    //   inject: [ConfigService], 
    //   useFactory: async (configService: ConfigService) => {
    //     const store = await redisStore({
    //       socket: {
    //         host: configService.getOrThrow('REDIS_URI'),
    //         port: configService.getOrThrow('REDIS_PORT'),
    //       },
    //     });
    //     return {
    //       store: store as unknown as CacheStore,
    //       ttl: 3 * 60000, // 3 minutes (milliseconds)
    //     };
    //   },
    // }),

    // THROLLTER
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => [
    //     {
    //       ttl: config.get('THROTTLE_TTL'),
    //       limit: config.get('THROTTLE_LIMIT'),
    //     },
    //   ],
    // }),

    // GRAPHQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req }) => ({ req })
    }),

    //PrometheusModule
    PrometheusModule.register(),

    // COMMON
    UsersModule,
    AuthModule,
    ProductsModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor
    // },
    {
      provide:APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule {}
