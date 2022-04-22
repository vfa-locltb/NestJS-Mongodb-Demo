import { ObjectID } from "typeorm";

export class UpdateUserDto{
    id: ObjectID;
    name: string;
    email: string;
    password: string;
}