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
import { TypeOrmConfig } from './lib/config/typeorm.conn';
import { DbModule } from './db/db.module';
import { ClsModule } from 'nestjs-cls';
import { UserEntity } from './db/entities/user.entity';
import { envValidationSchema } from './lib/config/env.validation';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req) => {
          const session = req.session;
          if (session?.user) {
            const userEntity = new UserEntity({
              id: session.user.id,
            });

            cls.set('userId', userEntity);
          }
        },
      },
    }),
    CatsModule,
    LibModule,
    LoginModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
