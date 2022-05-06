import { NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
export declare class ValidateUserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
