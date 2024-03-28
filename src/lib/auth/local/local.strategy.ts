import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // default passport name: 'local'
  constructor(private readonly loginService: LoginService) {
    super({
      usernameField: 'username', // default: 'username'
      passwordField: 'password', // default: 'password'
    });
  }

  validate(username: string, password: string) {
    return this.loginService.login(username, password);
  }
}
