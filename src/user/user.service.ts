import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)private readonly userRepository: Repository<User>
  ){}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async create(data:any): Promise<User>
  {
    return await this.userRepository.save(data);
  }

  async findOne(conditions: any): Promise<User>{
    return await this.userRepository.findOne(conditions);
  }

  async setAvatar(id: string, avatarUrl: string):Promise<User>{
    this.userRepository.update(id,{profileImage: avatarUrl});
   return this.findOne(id);
  } 

}
