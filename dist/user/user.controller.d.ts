import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
export declare class UserController {
    private readonly userService;
    SERVER_URL: string;
    private readonly sizes;
    constructor(userService: UserService);
    findOne(id: string): Observable<User>;
    findAll(page: number, limit: number, username: string, request: any): Observable<Pagination<User>>;
    update(id: string, userData: User): Observable<User>;
    updateRole(id: string, user: User): Observable<User>;
    delete(id: string): Promise<DeleteResult>;
    uploadFile(id: string, file: any): Promise<Observable<User>>;
    private saveImage;
}
