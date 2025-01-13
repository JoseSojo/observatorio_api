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
        if(!body.ci) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.ci, error: true }
        if(!body.email) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.email, error: true }
        if(!body.lastname) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.lastname, error: true }
        if(!body.name) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.name, error: true }
        if(!body.password) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.password, error: true }
        if(!body.username) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.username, error: true }
        if(!body.usertype) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.rol, error: true }

        const responseService = await this.service.register({ data:body });
        return responseService;
    }

}
