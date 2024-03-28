import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginModule } from 'src/login/login.module';
import { LocalStrategy } from './auth/local/local.strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtSignService } from './auth/jwt/jwt-sign.service';
import { JwtStrategy } from './auth/jwt/jwt.strategy';

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
    LoginModule,
    PassportModule,
  ],
  providers: [LocalStrategy, JwtSignService, JwtStrategy],
  exports: [JwtSignService],
})
export class LibModule {}
