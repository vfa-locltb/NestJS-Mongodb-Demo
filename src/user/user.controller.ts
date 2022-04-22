import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException,Res, Req, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { log } from 'console';
import { DeleteResult } from 'typeorm';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private jwtService: JwtService,
    ) {}

  @Post('register')
  async register(@Body('name')name: string, @Body('email') email: string, @Body('password') password: string):Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userService.create({name, email, password: hashedPassword});
    return user;
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string, @Res({passthrough: true})Response: Response){
    const user = await this.userService.findOne({email});
    if(!user)
    {
      throw new BadRequestException('invalid credentials')
    }
    if(!await bcrypt.compare(password, user.password)){
      throw new BadRequestException('invalid credentials')
    }
    const jwt = await this.jwtService.signAsync({id: user.id});
    Response.cookie('jwt', jwt,{httpOnly:true});
    return {
      message: "Login successful",
    };
  }

  @Get('user')
  async user(@Req() request: Request){
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if(!data) {
        throw new UnauthorizedException();
      }
      const user = await this.userService.findOne(data['id'])
      const {password, ...result} = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException();
    }
   
  }

  @Get(':id')
  async userById(@Param('id') id: string) {
    const user =  await this.userService.findOne(id);
        return {
          statusCode: HttpStatus.OK,
          message: 'User fetched successfully',
          user,
        };
  }

  @Post('logout')
  async logout(@Res({passthrough: true})response: Response){
    response.clearCookie('jwt');

    return{
      message: 'Successfully logged out',
    }
  }

 
}
