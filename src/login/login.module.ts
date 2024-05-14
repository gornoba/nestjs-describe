import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LibModule } from 'src/lib/lib.module';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleLoginController } from './social/google-login.controller';
import { KakaoLoginController } from './social/kakao-login.controller';
import { NaverLoginController } from './social/naver-login.controller';

@Module({
  imports: [LibModule, DbModule, HttpModule],
  controllers: [
    LoginController,
    GoogleLoginController,
    KakaoLoginController,
    NaverLoginController,
  ],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
