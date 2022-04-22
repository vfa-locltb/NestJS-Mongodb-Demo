import { DeleteResult } from "typeorm";
import { UserDto } from "./user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    create(userData: User): Promise<any>;
    update(id: any, userData: UserDto): Promise<User>;
    delete(id: any): Promise<DeleteResult>;
}
