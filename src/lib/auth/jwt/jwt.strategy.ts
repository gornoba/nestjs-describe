import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.token;
        },
      ]), // 요청에서 JWT를 추출하는 방법을 제공
      ignoreExpiration: false, // 만료된 JWT 허용 여부
      secretOrKey: configService.get('JWT_SECRET'), // 비밀 키
    });
  }

  async validate(payload: any) {
    return { id: payload.id, username: payload.username };
  }
}
