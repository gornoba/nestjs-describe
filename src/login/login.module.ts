import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LibModule } from 'src/lib/lib.module';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleLoginController } from './social/google-login.controller';
import { KakaoLoginController } from './social/kakao-login.controller';
import { NaverLoginController } from './social/naver-login.controller';
import { SocialLoginService } from './social-login.service';
import { FirebaseAccountService } from './firebase/firebase.account.service';
import { LoginFirebaseController } from './login-firebase.controller';
import { FirebaeLoginService } from './firebase/firebae-login.service';

@Module({
  imports: [LibModule, DbModule, HttpModule],
  controllers: [
    LoginController,
    GoogleLoginController,
    KakaoLoginController,
    NaverLoginController,
    LoginFirebaseController,
  ],
  providers: [
    LoginService,
    SocialLoginService,
    FirebaseAccountService,
    FirebaeLoginService,
  ],
  exports: [LoginService],
})
export class LoginModule {}
