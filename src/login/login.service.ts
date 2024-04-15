import { Injectable } from '@nestjs/common';
import { UsersDto } from './dto/login.dto';
import { Response } from 'express';
import { UserRepository } from '../db/repositories/user.repository';
import { TransactionDeco } from 'src/lib/decorators/transaction.decorator';
import { UserEntity } from 'src/db/entities/user.entity';
@Injectable()
export class LoginService {
  constructor(private readonly userRepository: UserRepository) {}

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
    res.cookie('token', token, {
      secure: process.env.ENV === 'production', // https 프로토콜을 사용하는 경우 true
      httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못하도록 함
      maxAge: 1000 * 60 * 60, // 쿠키 유효 시간
      sameSite: 'none', // 쿠키 전송 위치 설정
    });
    return res;
  }

  setSession(req: any, user: UsersDto) {
    req.session.isAuthenticated = true;
    req.session.user = user;
    return '로그인 성공';
  }
}
