/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { User, UserDocument } from './user.models';
import { Model } from 'mongoose';
export declare class AppService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(user: User): Promise<User>;
    readUser(): Promise<void | (User & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    updateUser(id: any, data: any): Promise<User>;
    deleteUser(id: any): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
