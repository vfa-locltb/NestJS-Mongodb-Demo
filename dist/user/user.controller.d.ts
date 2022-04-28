import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteResult } from 'typeorm';
export declare class UserController {
    private readonly userService;
    SERVER_URL: string;
    private readonly sizes;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Observable<User>;
    findOne(id: any): Observable<User>;
    login(loginUserDto: LoginUserDto): Observable<Object>;
    findAll(request: any): Observable<User[]>;
    update(id: any, userData: User): Observable<User>;
    delete(id: any): Promise<DeleteResult>;
    uploadFile(id: any, file: any): Promise<Observable<User>>;
    private saveImage;
}
