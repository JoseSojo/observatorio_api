import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { SessionModel } from 'src/Model/M/User/SessionModel';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { LanguajeService } from '../Translate/LanguajeService';
import { TranslateType } from 'src/Validation/Translate';

@Injectable()
export class AuthService {

    private lang: TranslateType;

    constructor(
        private user: UserModel,
        private global: GlobalService,
        private session: SessionModel,
        private event: EventEmitter2,
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate();
    }

    public async HandleLogin(body: LoginDto): Promise<ReponseServiceDto>  {
        const userFound = await this.user.findBy({ filter:[{OR:[{email:body.param},{username:body.param}]}] });

        if(!userFound) {
            return {
                error: true,
                body: null,
                message: this.lang.Auth.ACCESS_EMAIL
            }
        }
        const jwtPrimse = this.global.GenerateToken({ id:userFound.id });

        const match = await this.global.Compare({ password:body.password, dbPassword:userFound.password });

        if(!match) {
            return {
                error: true,
                body: null,
                message: this.lang.Auth.ACCESS_PASSWORD
            }
        }

        // generate jwt
        const jwt = await jwtPrimse;
        await this.session.create({ data:{ id:jwt,token:jwt,userReference:{connect:{id:userFound.id}} } });

        // emit
        const dataEmit: ListenerPayloadHistory = {
            event:`create.session`,
            model:`session`,
            name:`session`,
            userId: userFound.id
        }
        this.event.emit(`session`, dataEmit);

        return {
            body: {
                user: userFound,
                token: jwt
            },
            error: false,
            message: this.lang.Auth.SUCCESS
        }
    }    

    @OnEvent(`session`)
    private async ListenerSession() {}

}