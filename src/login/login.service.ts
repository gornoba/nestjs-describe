import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersDto } from './dto/login.dto';
import { Response } from 'express';
@Injectable()
export class LoginService {
  private readonly users: UsersDto[] = [
    {
      id: 1,
      username: 'atreides',
      password: '12',
    },
    {
      id: 2,
      username: 'harkonnen',
      password: '23',
    },
    {
      id: 3,
      username: 'Fremen',
      password: '34',
    },
    {
      id: 4,
      username: 'Corrino',
      password: '45',
    },
  ];

  login(username: string, password: string): UsersDto {
    const findUser = this.users.find((user) => user.username === username);

    if (!findUser) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    if (findUser.password !== password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return new UsersDto(findUser);
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
}
