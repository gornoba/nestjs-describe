import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/lib/auth/local/local.guard';
import { Request, Response } from 'express';
import { LoginService } from 'src/login/login.service';
import { UsersDto } from './dto/login.dto';
import { JwtSignService } from 'src/lib/auth/jwt/jwt-sign.service';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(
    private readonly jwtSignService: JwtSignService,
    private readonly loginService: LoginService,
  ) {}

  @ApiBody({ type: UsersDto })
  @UseGuards(LocalAuthGuard)
  @Post('jwt')
  async loginCookie(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const user = req.user as UsersDto;
    const jwt = await this.jwtSignService.signJwt({ ...user });
    this.loginService.setCookie(res, jwt);
    return '로그인 성공';
  }

  @ApiBody({ type: UsersDto })
  @UseGuards(LocalAuthGuard)
  @Post('session')
  async loginSession(@Req() req: Request): Promise<string> {
    return this.loginService.setSession(req, req.user as UsersDto);
  }
}
