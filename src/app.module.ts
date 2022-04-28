import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserSchema } from './user.models';
import {typeOrmAsyncConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
            TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
            // MongooseModule.forRoot('mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-auth-jwt?retryWrites=true&w=majority'),
            // MongooseModule.forFeature([{name:'user',schema: UserSchema}]),
            AuthModule,
            UserModule,
],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
