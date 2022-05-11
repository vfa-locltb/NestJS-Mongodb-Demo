import { AuthService } from 'src/auth/auth.service';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
export declare class UserService {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: Repository<User>, authService: AuthService);
    create(CreateUserDto: CreateUserDto): Observable<any>;
    createCode(body: any): User[];
    login(loginUserDto: LoginUserDto): Observable<string>;
    findOne(id: any): Observable<User>;
    findOnes(id: any): Promise<any>;
    findAll(): Observable<User[]>;
    paginate(options: IPaginationOptions): Observable<Pagination<User>>;
    update(id: string, user: User): Observable<User>;
    updateRole(id: string, user: User): Observable<any>;
    updatePassword(id: string, data: any): Observable<any>;
    updateCode(id: string, data: any): Observable<any>;
    delete(id: any): Promise<DeleteResult>;
    checkPassword(password: string, old_password: string): Observable<any>;
    private findUserByEmail;
    private validatePassword;
    private mailExists;
    setAvatar(id: string, avatarUrl: string): Observable<User>;
}
