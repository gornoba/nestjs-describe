import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local/local.strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtSignService } from './auth/jwt/jwt-sign.service';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { Transaction } from './decorators/transaction.decorator';
import { AutoAspectExecutor } from './services/auto-aspect-executor';
import { DiscoveryModule } from '@nestjs/core';
import { Lazy } from './decorators/lazy.decorator';
import { CacheDecoFn } from './decorators/cache.decorator';
import { AsyncLocalStorage } from 'async_hooks';
import { CustomEmitterService } from './services/custom-emiter';
import { ImageOptimizeService } from './services/image-optimize';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
    }),
    PassportModule,
    DiscoveryModule,
  ],
  providers: [
    LocalStrategy,
    JwtSignService,
    JwtStrategy,
    Transaction,
    CacheDecoFn,
    AutoAspectExecutor,
    Lazy,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    CustomEmitterService,
    ImageOptimizeService,
  ],
  exports: [
    JwtSignService,
    AsyncLocalStorage,
    CustomEmitterService,
    ImageOptimizeService,
  ],
})
export class LibModule {}
