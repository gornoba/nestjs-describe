import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Post('create')
  async createAccount(@Body() body: UsersDto) {
    return this.loginService.createAccount(body);
  }

  @ApiParam({ name: 'id', type: Number, example: 4 })
  @Get('user/:id')
  async getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.loginService.getUser(id);
  }

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

  @Get('cookie-set')
  async cookieSet(@Res({ passthrough: true }) res: Response) {
    this.loginService.setSignedCookie(res, 'test', 'cookie');
    return '쿠키 설정 완료';
  }

  @Get('cookie-get')
  async cookieGet(@Req() req: Request) {
    const result = this.loginService.getCookie(req);
    return result;
  }
}
