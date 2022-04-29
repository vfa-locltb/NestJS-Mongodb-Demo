import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateJwt(user: User): Observable<string>;
    hashPassword(password: string): Observable<string>;
    comparePasswords(password: string, storedPasswordHash: string): Observable<any>;
    verifyJwt(jwt: string): Observable<any>;
}
