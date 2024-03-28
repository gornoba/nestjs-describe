import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersDto } from './dto/login.dto';

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
}
