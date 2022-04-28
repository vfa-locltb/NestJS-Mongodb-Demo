import { ObjectID } from "typeorm";
export declare class User {
    id: ObjectID;
    name: string;
    email: string;
    profileImage: string;
    password: string;
    emailToLowerCase(): void;
}
