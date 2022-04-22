import { BaseEntity, ObjectID } from "typeorm";
export declare class User extends BaseEntity {
    id: ObjectID;
    name: string;
    lastName: string;
    email: string;
    phone: string;
}
