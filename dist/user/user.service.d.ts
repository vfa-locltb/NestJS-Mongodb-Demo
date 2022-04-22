import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(data: any): Promise<User>;
    findOne(conditions: any): Promise<User>;
}
