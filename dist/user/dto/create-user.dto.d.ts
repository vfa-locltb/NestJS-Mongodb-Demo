import { UserRole } from "../entities/user.entity";
import { LoginUserDto } from "./login-user.dto";
export declare class CreateUserDto extends LoginUserDto {
    name: string;
    role: UserRole;
    code: string;
}
