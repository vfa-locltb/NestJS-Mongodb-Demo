import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
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
const maxSize = 1 * 5024 * 5024;




@Controller('user')
export class UserController {
  SERVER_URL:  string  =  "http://localhost:3000/";
  private readonly sizes: string [];
  constructor(private readonly userService: UserService) {
    this.sizes = ['50X50', '100X100', '200X200'];
  }


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
    @hasRoles(UserRole.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(@Req() request): Observable<User[]> {
      return this.userService.findAll();
    }

    @Put('edit/:id')
     update(@Param('id') id, @Body() userData: User):Observable<User>{
         return this.userService.update(id,userData);
    }
    @Put('edit/:id/role')
    updateRole(@Param('id') id, @Body() user: User) : Observable<User> {
      return from(this.userService.updateRole(id,user));
    }


    @Delete('delete/:id')
    async delete(@Param('id')id):Promise<DeleteResult>{
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
      
    }))
    
    async uploadFile(@Param('id') id, @UploadedFile() file){
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
  

}
