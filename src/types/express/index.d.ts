import { JwtPayload } from 'jsonwebtoken';
//https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
declare module 'express-serve-static-core' {
    interface Request {
        context?: JwtPayload;
    }
}
