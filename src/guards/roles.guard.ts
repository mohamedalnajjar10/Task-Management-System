import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/Roles-decorator';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission (roles)');
        }

        return true;
    }
}

// import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from 'src/decorator/Roles-decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);

//         if (!requiredRoles) return true;

//         const { user } = context.switchToHttp().getRequest();

//         if (!user || !requiredRoles.includes(user.role)) {
//             throw new ForbiddenException('You do not have permission (roles)');
//         }

//         return true;
//     }
// }
