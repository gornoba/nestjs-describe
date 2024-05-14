import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { KakaoAuth, KakaoIdNotExists, KakaoIdExists } from '../dto/kakao.dto';
import { SocialLoginService } from '../social-login.service';

@ApiTags('kakao-login')
@Controller('kakao-login')
export class KakaoLoginController {
  private readonly kakao = JSON.parse(this.configService.get('KAKAO'));

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly socialLoginService: SocialLoginService,
  ) {}

  @ApiOperation({
    summary: '카카오 로그인을 위한 API',
  })
  @ApiOkResponse({
    description: '카카오 로그인 페이지로 이동',
    type: KakaoIdNotExists,
  })
  @Get('authorize')
  authorize(@Res() res: Response) {
    const query = new URLSearchParams({
      client_id: this.kakao.restApiKey,
      redirect_uri: this.kakao.redirectUri,
      response_type: 'code',
    });

    res
      .status(302)
      .redirect(`https://kauth.kakao.com/oauth/authorize?${query}`);
  }

  @ApiOperation({
    summary: '일반사용 X, 카카오 로그인 후 redirect API',
    description: `카카오 로그인 후 redirect API로 이동하여 로그인 처리`,
  })
  @Get('redirect')
  async redirect(
    @Query('code') code: string,
  ): Promise<KakaoIdNotExists | KakaoIdExists> {
    const result = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.kakao.restApiKey,
          redirect_uri: this.kakao.redirectUri,
          code,
          client_secret: this.kakao.secretKey,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    // 토큰을 이용하여 아이디 조회
    const oauthToken = result.data as KakaoAuth;
    const tokenVerify = await this.socialLoginService.socialTokenVerify(
      'kakaoUser',
      oauthToken.access_token,
    );

    return tokenVerify;
  }
}
