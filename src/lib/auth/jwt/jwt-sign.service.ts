import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersDto } from 'src/login/dto/login.dto';

@Injectable()
export class JwtSignService {
  constructor(private readonly JwttService: JwtService) {}

  async signJwt(user: UsersDto) {
    return await this.JwttService.signAsync(user);
  }
}
