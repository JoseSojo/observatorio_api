import { Body, Controller, Post } from '@nestjs/common';
import { AuthLogin, AuthRegister } from './guard/auth.guard';
import AuthService from './auth.service';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';

@Controller('auth')
export class AuthController {

    private lang: LanguajeInterface;

    constructor(
        private service: AuthService,
        private languaje: LanguajeService
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @Post(`login`)
    private async login(@Body() body: AuthLogin) {

        // validación

        const responseService = await this.service.login({ data:body });

        return responseService;
    }

    @Post(`register`)
    private async register(@Body() body: AuthRegister) {

        // validación

        const responseService = await this.service.register({ data:body });
        return responseService;
    }

}
