import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoginFactory } from 'src/Factory/AuthFactory/LoginFactory';
import { RegisterFactory } from 'src/Factory/AuthFactory/RegisterFactory';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { UserModel } from 'src/Model/M/User/UserModel';
import { AuthService } from 'src/Service/Auth/AuthService';
import { UserService } from 'src/Service/User/UserService';
import { LoginDto } from 'src/Validation/Auth/LoginDto';

@Controller('/gui/auth')
export class AuthApiGuiController {

    constructor(
        private loginFactory: LoginFactory,
        private registerFactory: RegisterFactory
    ) {}

    @Get(`/login`)
    public async login() {
        
        const form = this.loginFactory.LoginGUI();
        return {form};
    }

    @Get(`/register`)
    public async register() {
        
        const form = this.registerFactory.RegisterGUI();
        return {form};
    }



}
