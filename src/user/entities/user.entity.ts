import { BeforeInsert, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

export enum UserRole{
    Admin = "admin",
    Editor = "editor",
    User = "user",
}
@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.User})
    role: UserRole;

    @Column()
    profileImage: string;

    @Column({select: false})
    password: string;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    }
}
