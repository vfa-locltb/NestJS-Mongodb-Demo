import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './user.models';
import {typeOrmAsyncConfig } from './config/typeorm.config'

@Module({
  imports: [
            TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
            MongooseModule.forRoot('mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-auth-jwt?retryWrites=true&w=majority'),
            MongooseModule.forFeature([{name:'user',schema: UserSchema}]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
