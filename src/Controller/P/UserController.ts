import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { UserModel } from 'src/Model/M/User/UserModel';
import { AuthService } from 'src/Service/Auth/AuthService';
import { UserService } from 'src/Service/User/UserService';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { CreateUserType } from 'src/Validation/User/CreateType';

@Controller('/p/user')
export class UserController {

    constructor(
        private user: UserService,
        private auth: AuthService,
        private permitFactory: PermitsFactory,
    ) {}

    @Post(`/login`)
    public async login(@Body() body: LoginDto) {
        const response = await this.auth.HandleLogin(body);

        if(!response.error) {
            // handle error
           return response;
        }

        return response;
    }

}
