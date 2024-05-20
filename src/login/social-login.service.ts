import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { KakaoToken, KakaoUser } from './dto/kakao.dto';
import { NaverToken } from './dto/naver.dto';
import { GoogleUser } from './dto/google.dto';

@Injectable()
export class SocialLoginService {
  private readonly socialApiList = {
    kakaoToken: async (accessToken: string): Promise<KakaoToken> => {
      const result = await firstValueFrom(
        this.httpService.get(
          'https://kapi.kakao.com/v1/user/access_token_info',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      const tokenData = result.data as KakaoToken;

      return tokenData;
    },
    kakaoUser: async (accessToken: string): Promise<KakaoUser> => {
      const result = await firstValueFrom(
        this.httpService.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const userData = result.data as KakaoUser;

      return userData;
    },
    naverToken: async (accessToken: string): Promise<NaverToken> => {
      const result = await firstValueFrom(
        this.httpService.get(`https://openapi.naver.com/v1/nid/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      const tokenData = result.data as NaverToken;

      return tokenData;
    },
    googleToken: async (accessToken: string): Promise<GoogleUser> => {
      const result = await firstValueFrom(
        this.httpService.get(`https://www.googleapis.com/userinfo/v2/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const userData = result.data as GoogleUser;

      return userData;
    },
  };

  constructor(private readonly httpService: HttpService) {}

  async socialTokenVerify(
    key: 'kakaoToken' | 'kakaoUser' | 'naverToken' | 'googleToken',
    token: string,
  ) {
    const result = this.socialApiList[key].bind(this);
    return await result(token);
  }
}
