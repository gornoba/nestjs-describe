import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const authorization = request.headers?.authorization;
    const authorizationSplit = authorization?.split(' ');
    const token = authorizationSplit?.[1];

    if (!token || authorizationSplit?.[0] !== 'Bearer' || token !== 'hellow') {
      return false;
    }

    return true;
  }
}
