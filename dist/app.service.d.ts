import { User, UserDocument } from './user.models';
import { Model } from 'mongoose';
export declare class AppService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(user: User): Promise<User>;
}
