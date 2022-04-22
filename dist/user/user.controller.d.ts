import { HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
export declare class UserController {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<User>;
    login(email: string, password: string, Response: Response): Promise<{
        message: string;
    }>;
    user(request: Request): Promise<{
        id: import("typeorm").ObjectID;
        name: string;
        email: string;
    }>;
    userById(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        user: User;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
