import { BeforeInsert, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    profileImage: string;

    @Column({select: false})
    password: string;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    }
}
