import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { LoginUserDto } from "./login-user.dto";

export class CreateUserDto extends LoginUserDto {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    role: UserRole;

    @ApiProperty()
    token: string;

}
