/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { AppService } from './app.service';
import { User } from './user.models';
import { UserUpdateDto } from './userUpdate.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createUser(userDto: User): Promise<User>;
    readUser(): Promise<void | (User & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    updateUser(id: string, updateData: UserUpdateDto): Promise<User>;
    deleteUser(id: string): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
