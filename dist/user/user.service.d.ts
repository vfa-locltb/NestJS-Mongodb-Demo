import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: Repository<User>, authService: AuthService);
    create(CreateUserDto: CreateUserDto): Observable<any>;
    login(loginUserDto: LoginUserDto): Observable<string>;
    findOne(id: any): Observable<User>;
    findAll(): Observable<User[]>;
    private findUserByEmail;
    private validatePassword;
    private mailExists;
    setAvatar(id: string, avatarUrl: string): Observable<User>;
}
