import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './user.models';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://chuongnvt:jlcjQt5uax0lfkxt@cluster0.uosty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
            MongooseModule.forFeature([{name:'user',schema: UserSchema}]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
