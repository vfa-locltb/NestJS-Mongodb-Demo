import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserSchema } from './user.models';
import {typeOrmAsyncConfig } from './config/typeorm.config'
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
            ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }), 
            TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
            // MongooseModule.forRoot('mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-auth-jwt?retryWrites=true&w=majority'),
            // MongooseModule.forFeature([{name:'user',schema: UserSchema}]),
            UserModule,
],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule{
}
