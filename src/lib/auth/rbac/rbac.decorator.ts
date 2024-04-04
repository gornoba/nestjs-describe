import { SetMetadata } from '@nestjs/common';
import { Role } from './rbac.role';
import { ROLES_KEY } from './rbac.constant';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
