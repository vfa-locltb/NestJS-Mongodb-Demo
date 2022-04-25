import { ObjectID } from "typeorm";
export declare class User {
    id: ObjectID;
    name: string;
    profileImage: string;
    email: string;
    password: string;
    emailToLowerCase(): void;
}
