import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MailerService } from '@nestjs-modules/mailer';
export declare class UserController {
    private readonly userService;
    private mailerService;
    SERVER_URL: string;
    private readonly sizes;
    constructor(userService: UserService, mailerService: MailerService);
    create(createUserDto: CreateUserDto): Observable<User>;
    findOne(id: string): Observable<User>;
    login(loginUserDto: LoginUserDto): Observable<Object>;
    findAll(page: number, limit: number, username: string, request: any): Observable<Pagination<User>>;
    update(id: string, userData: User): Observable<User>;
    updateRole(id: string, user: User): Observable<User>;
    delete(id: string): Promise<DeleteResult>;
    uploadFile(id: string, file: any): Promise<Observable<User>>;
    private saveImage;
    forgot(email: string): Promise<{
        massage: string;
    }>;
    reset(code: string, password: string, password_confirm: string): Promise<{
        massage: string;
    }>;
    changePassword(email: string, old_password: string, new_password: string, confirm_password: string): Promise<{
        massage: string;
    }>;
}
