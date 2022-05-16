import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, BadRequestException, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { from, map, Observable } from 'rxjs';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
const bcrypt = require('bcrypt');

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private readonly userService: UserService,
    private mailerService: MailerService) {}

  @Post('/register')
   create(@Body() createUserDto: CreateUserDto ): Observable<User> {
     return from(this.userService.create(createUserDto));
  }

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

   // Forgot password
   @Post('forgotPassword')
   async forgot(@Body('email') email: string)
   {
     const code = Math.floor(100000 + Math.random() * 900000).toString();
 
     const user: any = await this.userService.findOnes({email});
   
     await this.userService.updateCode(user.id,{code})
     
     // const url = `http://localhost:3000/reset/${code}`;
 
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
   async reset(@Body('code') code: string, @Body('password') password: string, @Body('password_confirm') password_confirm: string)
   {
     if(password !== password_confirm)
     {
       throw new BadRequestException('password do not match');
     }
 
     const passwordReset: any = await this.userService.findOnes({code});
     console.log(passwordReset);
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
