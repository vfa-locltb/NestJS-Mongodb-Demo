import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class User extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    phone: string;
}