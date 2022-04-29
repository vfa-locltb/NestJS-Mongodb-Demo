import { ObjectID } from "typeorm";
export declare enum UserRole {
    Admin = "admin",
    Editor = "editor",
    User = "user"
}
export declare class User {
    id: ObjectID;
    name: string;
    email: string;
    role: UserRole;
    profileImage: string;
    password: string;
    emailToLowerCase(): void;
}
