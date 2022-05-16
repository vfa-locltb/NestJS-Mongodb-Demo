import { forwardRef, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ forwardRef(() => UserModule),
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

  })],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
