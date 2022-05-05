import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class LoginUserDto {
    @ApiPropertyOptional()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    password: string;
}