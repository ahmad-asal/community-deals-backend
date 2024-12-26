import { rolesTypes } from '@/interfaces/user.interfaces';
import { Request, Response, NextFunction } from 'express';

export function authorizeRole(allowedRoles: rolesTypes) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.context;
        console.log({ allowedRoles });
        if (user && ![allowedRoles].includes(user.role)) {
            return res.status(403).json({
                message: `Forbidden, you are a ${user.role} and this service is only available for ${allowedRoles}`,
            });
        }

        next();
    };
}
