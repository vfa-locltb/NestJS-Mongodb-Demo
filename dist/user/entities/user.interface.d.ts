export interface UserI {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
}
export declare enum UserRole {
    ADMIN = "admin",
    CHIEFEDITOR = "chiefeditor",
    EDITOR = "editor",
    USER = "user"
}
