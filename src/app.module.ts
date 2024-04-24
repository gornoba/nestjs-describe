import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { CacheModule } from '@nestjs/cache-manager';
import { cacheModuleOptions } from './lib/config/cache.config';
import { RedisClientOptions } from 'redis';
import { AsyncLocalStorage } from 'async_hooks';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    TypeOrmModule.forRootAsync(TypeOrmMongoConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    CacheModule.registerAsync<RedisClientOptions>(cacheModuleOptions),
    ScheduleModule.forRoot(),
    CatsModule,
    LibModule,
    LoginModule,
    DbModule,
    MongoModule,
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
      .apply((req, res, next) => {
        const session = req.session;
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
  }
}
