import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateUserMiddleware } from 'src/middleware/validate.user.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from 'src/login/login.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }), 
  AuthModule, LoginModule
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule implements NestModule  {
  configure(consumer: MiddlewareConsumer)
  {
    consumer.apply(ValidateUserMiddleware).exclude(
      {
        path: 'api/user',
        method: RequestMethod.GET,
      }
    ).forRoutes(UserController);
}
} 
