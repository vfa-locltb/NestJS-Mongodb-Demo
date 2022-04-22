import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
    name: 'default',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'nestjs-auth-jwt',
    useNewUrlParser: true,
    autoLoadEntities: true,
    useUnifiedTopology: true,
    entities: [join(__dirname,'**/**.entity{.ts,.js}')]
  }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'},
    })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
