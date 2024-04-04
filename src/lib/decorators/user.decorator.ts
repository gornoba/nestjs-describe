import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersDto } from 'src/login/dto/login.dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UsersDto => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.session?.user?.[data] : request.session?.user;
  },
);
