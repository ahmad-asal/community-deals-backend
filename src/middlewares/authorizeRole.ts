import { rolesTypes } from '@/interfaces/user.interfaces';
import { Request, Response, NextFunction } from 'express';

export function authorizeRole(allowedRoles: rolesTypes[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.context;
        if (
            !user ||
            !user.roles ||
            !user.roles.some((role: rolesTypes) => allowedRoles.includes(role))
        ) {
            return res.status(403).json({
                message: 'Your dont have enough roles to access this route',
            });
        }

        // if (user && ![allowedRoles].includes(user.role)) {
        //     return res.status(403).json({
        //         message: `Forbidden, you are a ${user.role} and this service is only available for ${allowedRoles}`,
        //     });
        // }

        next();
    };
}
