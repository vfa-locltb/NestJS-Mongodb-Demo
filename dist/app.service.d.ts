import { User, UserDocument } from './user.models';
import { Model } from 'mongoose';
export declare class AppService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(user: User): Promise<User>;
    readUser(): Promise<void | (User & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    updateUser(id: any, data: any): Promise<User>;
    deleteUser(id: any): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
