import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty()
    name: string;

    @Column({unique: true})
    @ApiProperty()
    email: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.User})
    @ApiProperty()
    role: UserRole;

    @Column()
    @ApiProperty()
    profileImage: string;

    @Column({select: false})
    @ApiProperty()
    password: string;

    @Column()
    @ApiProperty()
    token: string

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    }
}
