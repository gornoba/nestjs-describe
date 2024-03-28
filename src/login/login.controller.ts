import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/lib/auth/local/local.guard';
import { Request } from 'express';

@ApiTags('login')
@Controller('login')
export class LoginController {
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req: Request) {
    return req.user;
  }
}
