import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }
  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: string, user: UserDto): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async delete(id): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
