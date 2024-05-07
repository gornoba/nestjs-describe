import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { CatsModule } from './cats/cats.module';
import { LibModule } from './lib/lib.module';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './lib/middlewares/logger.middleware';
import { CatsController } from './cats/cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './lib/config/typeorm.postgre';
import { DbModule } from './db/db.module';
import { UserEntity } from './db/entities/user.entity';
import { envValidationSchema } from './lib/config/env.validation';
import { TypeOrmMongoConfig } from './lib/config/typeorm.mongo';
import { MongoModule } from './mongoDb/mongo.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { cacheModuleOptions } from './lib/config/cache.config';
import { AsyncLocalStorage } from 'async_hooks';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { NextFunction, Request, Response } from 'express';
import { RequestMiddleware } from './lib/middlewares/request.middleware';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { bullModuleOptions } from './lib/config/queue.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FileModule } from './file/file.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    TypeOrmModule.forRootAsync(TypeOrmMongoConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    CacheModule.registerAsync<CacheModuleOptions>(cacheModuleOptions),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync(bullModuleOptions),
    EventEmitterModule.forRoot({
      maxListeners: 10,
    }),
    CronModule,
    CatsModule,
    LibModule,
    LoginModule,
    DbModule,
    MongoModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly als: AsyncLocalStorage<{
      userId: UserEntity;
    }>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const session = req.session as any;

        // session 초기화
        if (!session?.isInitialized && /^\/api/.test(req.baseUrl)) {
          session.isInitialized = true;
        }

        // async local storage에 user 정보 저장
        if (session?.user) {
          const userEntity = new UserEntity({
            id: session.user.id,
          });
          const store = {
            userId: userEntity,
          };
          this.als.run(store, () => next());
        } else {
          next();
        }
      })
      .forRoutes('*');
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
