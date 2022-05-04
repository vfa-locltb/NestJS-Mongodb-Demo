import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { from, map, Observable, raceWith, switchMap } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
 constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
 @Inject(forwardRef(() => AuthService)) 
  private readonly authService: AuthService
 ){}
      

 create(CreateUserDto: CreateUserDto): Observable<any>{
   const userEntity =  this.userRepository.create(CreateUserDto);

   return this.mailExists(userEntity.email).pipe(
    switchMap((exists: boolean) => {
      if (!exists) {
        return this.authService.hashPassword(userEntity.password).pipe(
          switchMap((passwordHash: string) => {
            // Overwrite the user password with the hash, to store it in the db
            userEntity.password = passwordHash;
            return from(this.userRepository.save(userEntity)).pipe(
              map((savedUser: User) => {
                const { password, ...user } = savedUser;
                return user;
              })
            )
          })
        )
      } else {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    })
  )
}

login(loginUserDto: LoginUserDto): Observable<string> {
  return this.findUserByEmail(loginUserDto.email.toLowerCase()).pipe(
    switchMap((user: User) => {
      if (user) {
        return this.validatePassword(loginUserDto.password, user.password).pipe(
          switchMap((passwordsMatches: boolean) => {
            if (passwordsMatches) {
              return this.findOne(user.id).pipe(
                switchMap((user: User) => this.authService.generateJwt(user))
              )
            } else {
              throw new HttpException('Login was not Successfull', HttpStatus.UNAUTHORIZED);
            }
          })
        )
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
    )
  )
}


findOne(id: any): Observable<User> {
  return from(this.userRepository.findOne(id));
}

 findAll(): Observable<User[]>{
   return from(this.userRepository.find());
 }

  update(id: string, user: User): Observable<User> {
   this.userRepository.update(id, user);
  return this.findOne(id);
}
  updateRole(id: string, user: User): Observable<any> {
    this.userRepository.update(id,user);
    return this.findOne(id);
  }

delete(id): Promise<DeleteResult> {
  return this.userRepository.delete(id);
}


 private findUserByEmail(email: string): Observable<User>{
   return from(this.userRepository.findOne({email},{select: ['id','name','email','password']}));
 }

 private validatePassword(password: string, storedPasswordHash: string): Observable<boolean>{
   return this.authService.comparePasswords(password, storedPasswordHash);
 }

 private mailExists(email: string): Observable<boolean> {
  email = email.toLowerCase();
  return from(this.userRepository.findOne({ email })).pipe(
    map((user: User) => {
      if (user) {
        return true;
      } else {
        return false;
      }
    })
  )
}

setAvatar(id: string, avatarUrl: string):Observable<User>{
  this.userRepository.update(id,{profileImage: avatarUrl});
 return this.findOne(id);
} 


}
