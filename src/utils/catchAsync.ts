import { NextFunction } from 'express';

export const catchAsync = (fn: Function) => {
    const errorHandler = (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };

    return errorHandler;
};
