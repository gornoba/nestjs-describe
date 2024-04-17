import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy, 'local')
  implements OnModuleInit
{
  private loginService: LoginService;

  // default passport name: 'local'
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      usernameField: 'username', // default: 'username'
      passwordField: 'password', // default: 'password'
    });
  }

  onModuleInit() {
    this.loginService = this.moduleRef.get(LoginService, { strict: false });
  }

  validate(username: string, password: string) {
    return this.loginService.login(username, password);
  }
}
