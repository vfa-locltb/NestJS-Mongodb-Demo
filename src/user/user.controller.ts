import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { UserDto } from "./user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(private userService: UserService){}

    @Get('/')
    findAll(): Promise<User[]>{
        return this.userService.findAll();
    }

    @Post('/create')
    async create(@Body() userData: User):Promise<any>{
        return this.userService.create(userData);
    }

    @Put('/:id')
    async update(@Param('id') id, @Body() userData: UserDto):Promise<User>{
         return this.userService.update(id,userData);
    }

    @Delete('/:id')
    async delete(@Param('id')id):Promise<DeleteResult>{
        return this.userService.delete(id);
    }


}