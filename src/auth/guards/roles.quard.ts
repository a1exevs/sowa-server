import {
    CanActivate,
    ExecutionContext, ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/authRoles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
      private jstService: JwtService,
      private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if(bearer !== 'Bearer' || !token)
                throw new HttpException('Пользователь не авторизован', HttpStatus.FORBIDDEN);

            const user = this.jstService.verify(token);
            request.user = user;

            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if(requiredRoles) {
                let haveRoles = true;
                requiredRoles.forEach((requiredRole) => {
                    haveRoles = haveRoles && user.roles.some(userRole => userRole.value == requiredRole);
                })
                if(!haveRoles)
                    throw new HttpException('Не достаточно прав', HttpStatus.FORBIDDEN);
            }
            return true;
        }
        catch (e)
        {
            console.log(e);
            throw new ForbiddenException('Нет доступа');
        }
    }
}