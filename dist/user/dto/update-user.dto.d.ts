import { ObjectID } from "typeorm";
export declare class UpdateUserDto {
    id: ObjectID;
    name: string;
    email: string;
    password: string;
}
