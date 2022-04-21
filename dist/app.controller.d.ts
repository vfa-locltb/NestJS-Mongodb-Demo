import { AppService } from './app.service';
import { User } from './user.models';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createUser(userDto: User): Promise<User>;
}
