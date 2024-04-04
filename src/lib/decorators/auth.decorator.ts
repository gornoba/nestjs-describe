import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ROLES_KEY } from '../auth/rbac/rbac.constant';
import { SessionGuard } from '../auth/session/session.guard';
import { RolesGuard } from '../auth/rbac/rbac.guard';
import { Role } from '../auth/rbac/rbac.role';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(SessionGuard, RolesGuard),
  );
}
