import {  Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';


const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor( private readonly jwtService: JwtService,
){}

    generateJwt(user: User): Observable<string> {
        return from(this.jwtService.signAsync({user}));
    }

      hashPassword(password:string): Observable<string> {
          return from <string>(bcrypt.hash(password,12));
      }
      
      comparePasswords(password:string, storedPasswordHash: string): Observable<any> {
          return from(bcrypt.compare(password, storedPasswordHash));
      }

      verifyJwt(jwt:string): Observable<any> {
          return from(this.jwtService.verifyAsync(jwt));
      }
  
}
