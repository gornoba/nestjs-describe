import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { UserRepository } from '../db/repositories/user.repository';
import { TransactionDeco } from 'src/lib/decorators/transaction.decorator';
import { UserEntity } from 'src/db/entities/user.entity';
import CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  @TransactionDeco()
  createAccount(body: UsersDto) {
    return this.userRepository.upsert(UserEntity, [body]);
  }

  @TransactionDeco()
  getUser(id: number) {
    return this.userRepository.find(UserEntity, {
      where: { id },
    });
  }

  @TransactionDeco()
  login(
    username: string,
    password: string,
  ): Promise<UserEntity[] | UserEntity> {
    return this.userRepository.find(UserEntity, {
      where: {
        username,
        password,
      },
    });
  }

  setCookie(res: Response, token: string) {
    res.cookie('token', encodeURIComponent(token), {
      secure: process.env.ENV === 'production', // https 프로토콜을 사용하는 경우 true
      httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못하도록 함
      maxAge: 1000 * 60 * 60, // 쿠키 유효 시간
      sameSite: 'none', // 쿠키 전송 위치 설정
    });
    return res;
  }

  setSignedCookie(res: Response, key: string, value: string) {
    res.cookie(key, this.cookieEncrypt(value), {
      secure: process.env.ENV === 'production', // https 프로토콜을 사용하는 경우 true
      httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못하도록 함
      maxAge: 1000 * 60 * 60, // 쿠키 유효 시간
      signed: true,
    });
  }

  getCookie(req: Request) {
    const signedCookies = req.signedCookies;
    if (!signedCookies?.test) {
      throw new NotFoundException('쿠키가 없습니다.');
    }

    return this.cookieDecrypt(req.signedCookies.test);
  }

  setSession(req: any, user: UsersDto) {
    req.session.isAuthenticated = true;
    req.session.user = user;
    return '로그인 성공';
  }

  cookieEncrypt(value: string) {
    const secretKey = CryptoJS.SHA256(
      this.configService.get('COOKIE_SECRET'),
    ).toString();
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value),
      secretKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    return iv.toString(CryptoJS.enc.Hex) + encrypted.toString();
  }

  cookieDecrypt(cookieValue: string) {
    const ivHex = cookieValue.slice(0, 32);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedData = cookieValue.slice(32);
    const secretKey = CryptoJS.SHA256(
      this.configService.get('COOKIE_SECRET'),
    ).toString();

    const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
