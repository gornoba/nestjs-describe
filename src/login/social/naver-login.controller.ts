import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { NaverAuth } from '../dto/naver.dto';
import { SocialLoginService } from '../social-login.service';

@ApiTags('naver-login')
@Controller('naver-login')
export class NaverLoginController {
  private readonly naver = JSON.parse(this.configService.get('NAVER'));

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly socialLoginService: SocialLoginService,
  ) {}

  @ApiOperation({
    summary: '네이버 로그인을 위한 API',
  })
  @Get('authorize')
  authorize(@Res() res: Response) {
    const query = new URLSearchParams({
      client_id: this.naver.clientId,
      redirect_uri: this.naver.redirectUri,
      response_type: 'code',
      state: this.naver.state,
    });

    res
      .status(302)
      .redirect(`https://nid.naver.com/oauth2.0/authorize?${query}`);
  }

  @ApiOperation({
    summary: '일반사용 X, 네이버 로그인 후 redirect API',
    description: `네이버 로그인 후 redirect API로 이동하여 로그인 처리`,
  })
  @Get('redirect')
  async redirect(@Query('code') code: string) {
    const query = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.naver.clientId,
      client_secret: this.naver.secretKey,
      code,
      state: this.naver.state,
    });

    const result = await firstValueFrom(
      this.httpService.get(`https://nid.naver.com/oauth2.0/token?${query}`, {
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          'X-Naver-Client-Id': this.naver.clientId,
          'X-Naver-Client-Secret': this.naver.secretKey,
        },
      }),
    );

    const oauthToken = result.data as NaverAuth;
    const tokenVerify = await this.socialLoginService.socialTokenVerify(
      'naverToken',
      oauthToken.access_token,
    );

    return tokenVerify;
  }
}
