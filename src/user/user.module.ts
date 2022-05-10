import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateUserMiddleware } from 'src/middleware/validate.user.middleware';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com', 
      port: 465,
      auth: {
          user: 'chuongnvt@vitalify.asia',
          pass: 'taqazqbvisoghhkl'
      }

    },
    preview: true,
    defaults: {
                from: '"No Reply" <noreply@example.com>',
            },

  })
  ,AuthModule,
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
