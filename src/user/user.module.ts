import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateUserMiddleware } from 'src/middleware/validate.user.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }), 
  MailerModule.forRoot({
    transport: {
      host: process.env.M_HOST, 
      port: parseInt(process.env.M_PORT,10),
      auth: {
          user: process.env.M_USER,
          pass: process.env.M_PASS
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
