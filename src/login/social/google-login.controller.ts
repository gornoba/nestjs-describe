import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth } from '../dto/google.dto';
import { SocialLoginService } from '../social-login.service';

@ApiTags('google-login')
@Controller('google-login')
export class GoogleLoginController {
  private readonly google = JSON.parse(this.configService.get('GOOGLE'));

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly socialLoginService: SocialLoginService,
  ) {}

  @ApiOperation({
    summary: '구글 로그인을 위한 API',
  })
  @Get('authorize')
  authorize(@Res() res: Response) {
    const query = new URLSearchParams({
      client_id: this.google.clientId,
      redirect_uri: this.google.redirectUri,
      response_type: 'code',
      scope: 'email profile',
    });

    res
      .status(302)
      .redirect(`https://accounts.google.com/o/oauth2/v2/auth?${query}`);
  }

  @ApiOperation({
    summary: '일반사용 X, 구글 로그인 후 redirect API',
    description: `구글 로그인 후 redirect API로 이동하여 로그인 처리`,
  })
  @Get('redirect')
  async redirect(@Query('code') code: string) {
    const result = await firstValueFrom(
      this.httpService.post(
        `https://oauth2.googleapis.com/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.google.clientId,
          client_secret: this.google.secretKey,
          code,
          redirect_uri: this.google.redirectUri,
        }),
      ),
    );

    const oauthToken = result.data as GoogleAuth;

    const tokenVerify = await this.socialLoginService.socialTokenVerify(
      'googleToken',
      oauthToken.access_token,
    );

    return tokenVerify;
  }
}
