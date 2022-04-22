import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { retry } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)private readonly userRepository: Repository<User>
  ){}

  async create(data:any): Promise<User>
  {
    return await this.userRepository.save(data);
  }

  async findOne(conditions: any): Promise<User>{
    return await this.userRepository.findOne(conditions);
  }

}
