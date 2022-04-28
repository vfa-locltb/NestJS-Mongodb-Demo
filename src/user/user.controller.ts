import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { from, map, Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('/create')
   create(@Body() createUserDto: CreateUserDto ): Observable<User> {
     return from(this.userService.create(createUserDto));
  }

  @Get(':id')
  findOne(id): Observable<User> {
    return from(this.userService.findOne(id));
  } 
  // @Get()
  //  findAll(): Observable<User[]> {
  //   return  this.userService.findAll();
  // }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto): Observable<Object> {
    return this.userService.login(loginUserDto).pipe(
      map((jwt: string) => {
        return {
          access_token: jwt,
          token_type: 'jwt',
          expires_in: 10000
        }
      })
    );
  }


    // Requires Valid JWT from Login Request
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() request): Observable<User[]> {
      return this.userService.findAll();
    }

}
