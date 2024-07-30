import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;

    this.logger.log(`Checking roles for user with ID ${userId}.`);

    const hasRequiredRole = await this.authService.hasAdminRole(userId);

    if (hasRequiredRole) {
      this.logger.log(`User with ID ${userId} has the required roles.`);
    } else {
      this.logger.warn(`User with ID ${userId} does not have the required roles.`);
    }

    return hasRequiredRole;
  }
}
