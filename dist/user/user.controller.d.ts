import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Observable<User>;
    findOne(id: any): Observable<User>;
    login(loginUserDto: LoginUserDto): Observable<Object>;
    findAll(request: any): Observable<User[]>;
}