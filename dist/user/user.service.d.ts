import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getAllUser(): Promise<User[]>;
    create(data: any): Promise<User>;
    findOne(conditions: any): Promise<User>;
    setAvatar(id: string, avatarUrl: string): Promise<User>;
}
