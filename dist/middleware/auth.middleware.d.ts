import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserI } from "src/user/entities/user.interface";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth/auth.service";
export interface RequestModel extends Request {
    user: UserI;
}
export declare class AuthMiddleWare implements NestMiddleware {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
