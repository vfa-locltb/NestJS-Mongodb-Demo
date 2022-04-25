import { Controller, Get, Post, Body, Param, BadRequestException,Res, Req, UnauthorizedException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { log } from 'console';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { extname } from  'path';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
import * as sharp from 'sharp';




@Controller('user')
export class UserController {
  SERVER_URL:  string  =  "http://localhost:3000/";
  private readonly sizes: string [];
  constructor(private readonly userService: UserService,
              private jwtService: JwtService,
              
    ) {
      this.sizes = ['50X50', '100X100', '200X200'];
    }

    @Get('/')
    async getAllUser(): Promise<User[]> {
      return this.userService.getAllUser();
    }
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


  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination:'./uploads/profileimages',
      filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
  }))
  async uploadFile(@Param('id') id, @UploadedFile() file){
    // return of({imagePath: file.path})
    const [, ext] = file.mimetype.split('/');
    this.saveImage(ext, file);
    return this.userService.setAvatar(id,`${this.SERVER_URL}${file.path}`);
  }

private saveImage(ext: string, @UploadedFile() file): void{
    if(['jpeg', 'png','png'].includes(ext)){
      this.sizes.forEach((s:string)=>{
        const [size] = s.split('X');
        readFileAsync(file.path).then((b: Buffer)=>{
          return sharp(b).resize(+size).toFile(`./uploads/profileimages/${s}/${file.filename}`);
        }).then(console.log).catch(console.error);
      });
    }
}


 
}
