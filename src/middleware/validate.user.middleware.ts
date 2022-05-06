import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express"

@Injectable()
export class ValidateUserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('logger...', req.headers);
        next();
    }
}