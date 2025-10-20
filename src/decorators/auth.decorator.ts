import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ROLE } from 'src/shared/type';

export function Auth(role: ROLE): ReturnType<typeof applyDecorators>;
export function Auth(roles: ROLE[]): ReturnType<typeof applyDecorators>;
export function Auth(roleOrRoles: ROLE | ROLE[]) {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

  return applyDecorators(
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    UseGuards(AuthGuard, RolesGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
