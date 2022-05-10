import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Req, UseInterceptors, UploadedFile, Put, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { from, map, Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { diskStorage } from  'multer';
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
import * as sharp from 'sharp';
import { DeleteResult } from 'typeorm';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MailerService } from '@nestjs-modules/mailer';
const maxSize = 10 * 1024 * 1024;
const bcrypt = require('bcrypt');




@Controller('api')
@ApiTags('todos')
export class UserController {
  SERVER_URL:  string  =  "http://localhost:3000/";
  private readonly sizes: string [];
  constructor(private readonly userService: UserService, private mailerService: MailerService) {
    this.sizes = ['50X50', '100X100', '200X200'];
  }


  @Post('/register')
   create(@Body() createUserDto: CreateUserDto ): Observable<User> {
     return from(this.userService.create(createUserDto));
  }

  @Get('user/:id')
  findOne(@Param('id') id: string): Observable<User> {
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
    @hasRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('user')
    findAll( @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string, 
    @Req() request): Observable<Pagination<User>> {
      limit = limit > 100 ? 100 : limit;
        return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/user' });
  
    }

    @Put('edit/:id')
     update(@Param('id') id: string, @Body() userData: User):Observable<User>{
         return this.userService.update(id,userData);
    }

    @hasRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('edit/:id/role')
    updateRole(@Param('id') id: string, @Body() user: User) : Observable<User> {
      return from(this.userService.updateRole(id,user));
    }


    @Delete('delete/:id')
    async delete(@Param('id')id: string):Promise<DeleteResult>{
        return await this.userService.delete(id);
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
      limits: { fileSize: maxSize }
      
    }))
    
    
    async uploadFile(@Param('id') id:string, @UploadedFile() file){
      // return of({imagePath: file.path
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



  // Forgot password
  @Post('forgotPassword')
  async forgot(@Body('email') email: string)
  {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const user: any = await this.userService.findOnes({email});
  
    await this.userService.updateToken(user.id,{code})
    
    // const url = `http://localhost:3000/reset/${token}`;

    await this.mailerService.sendMail(
      {
        to: email,
        subject: 'Reset Your Password !',
        html: `<h2><strong>Code: <strong/><b style="color: blue">${code}<b/></h2> `,
      }
    );

    return {
      massage: 'Please check your email !'
    }
  }


  @Post('resetPassword')
  async reset(@Body('token') code: string, @Body('password') password: string, @Body('password_confirm') password_confirm: string)
  {
    if(password !== password_confirm)
    {
      throw new BadRequestException('password do not match');
    }

    const passwordReset: any = await this.userService.findOnes({code});

    if(!passwordReset)
    {
      throw new NotFoundException('Verify code not successful !');
    }

    const user = await this.userService.findOnes({email: passwordReset.email});

    if(!user)
    {
      throw new NotFoundException('User not found !');
      
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userService.updatePassword(user.id,{password: hashedPassword});
    return {
        massage: 'Reset Password Successful !'
    }
  }


  @Post('changePassword')
  async changePassword(@Body('email') email: string, @Body('old_password') old_password: string, 
  @Body('new_password') new_password: string, @Body('confirm_password') confirm_password: string) {
    const user:any = await this.userService.findOnes({email});
    if (!user)
    {
      throw new NotFoundException('User not found !');
    } 
      await this.userService.checkPassword(old_password, user.password);

    if(new_password !== confirm_password)
    {
      throw new NotFoundException('Password do not match');
    } 

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await this.userService.updatePassword(user.id, {password: hashedPassword});

    return {
      massage: 'Change password successful !'
    }
  }
  

}
