    import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { UserModel } from 'src/Model/M/User/UserModel';
import { AuthService } from 'src/Service/Auth/AuthService';
import { GlobalService } from 'src/Service/GlobalService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { UserService } from 'src/Service/User/UserService';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { TranslateType } from 'src/Validation/Translate';

@Controller('/auth')
export class AuthApiController {

    private lang: TranslateType;

    constructor(
        private auth: AuthService,
        private user: UserService,
        private global: GlobalService,
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate()
    }

    @Post(`/restore/password`)
    public async restorePassword(@Body() body: {email:string}, @Res() res: Response) {
        const {email} = body;

        const userFound = await this.user.FindUser({ filter:[{email}] });
        if(!userFound.body) {
            return res.status(404).json({ message:this.lang.Action.NOT_FOUND, error: true, body:null });
        }


        const response = await this.user.GenerateRestorePassword({ id:userFound.body.id });
        return res.json(response);
    }

    @Post(`/restore/save/password`)
    public async restoreSavePassword(@Body() body: any, @Res() res: Response) {
        const {token,password, repeatPassword} = body;


        const userFound = await this.user.FindUser({ filter:[{passwordRequetsToken:token}] });
        // requets date;
        if(!userFound.body) {
            return res.status(404).json({ message:this.lang.Action.NOT_FOUND, error: true, body:null });
        }
        
        if(password !- repeatPassword) {
            return res.status(404).json({ message:this.lang.Action.PASSWORD_NOT_MATCH, error: true, body:null });
        }

        const response = await this.user.UpdatePassword({ id:userFound.body.id,  password });
        return res.json(response);
    }

    @Post(`/login`)
    public async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const response = await this.auth.HandleLogin(body);

        if(response.error) {
            // handle register error
           return response;
        }

        return response;

        // return res
        //     .status(200)
        //     .cookie(`token`, response.body.token)
        //     .json(response);
    }

}
