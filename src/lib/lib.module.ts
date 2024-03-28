import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginModule } from 'src/login/login.module';
import { LocalStrategy } from './auth/local/local.strategy';

@Module({
  imports: [LoginModule, PassportModule],
  providers: [LocalStrategy],
})
export class LibModule {}
