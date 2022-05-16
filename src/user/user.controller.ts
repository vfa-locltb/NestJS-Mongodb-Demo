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
const maxSize = 10 * 1024 * 1024;
const bcrypt = require('bcrypt');




@Controller('api')
@ApiTags('todos')
export class UserController {
  SERVER_URL:  string  =  "http://localhost:3000/";
  private readonly sizes: string [];
  constructor(private readonly userService: UserService,) {
    this.sizes = ['50X50', '100X100', '200X200'];
  }


  

  @Get('user/:id')
  findOne(@Param('id') id: string): Observable<User> {
    return from(this.userService.findOne(id));
  } 
  // @Get()
  //  findAll(): Observable<User[]> {
  //   return  this.userService.findAll();
  // }

  


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



 
  

}
