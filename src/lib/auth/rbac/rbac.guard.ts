import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './rbac.role';
import { ROLES_KEY } from './rbac.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 지정된 Role이 없으면 true를 반환하여 모든 사용자가 접근할 수 있도록 합니다.
    if (!requiredRoles) {
      return true;
    }

    const requset = context.switchToHttp().getRequest();
    const session = requset.session;
    const user = session.user;

    if (user?.roles?.includes(Role.Admin)) {
      return true;
    }

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
