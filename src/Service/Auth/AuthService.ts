import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserModel } from 'src/Model/M/User/UserModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { SessionModel } from 'src/Model/M/User/SessionModel';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HistoryEventListener } from 'src/EventListener/HistoryEvent';
import { StaticticsForMonthEventListener } from 'src/EventListener/StaticticsForMonthEvent';
import { StaticticsForYearEventListener } from 'src/EventListener/StaticticsForYearEvent';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';

@Injectable()
export class AuthService {

    constructor(
        private user: UserModel,
        private global: GlobalService,
        private session: SessionModel,
        private event: EventEmitter2,
        private history: HistoryEventListener,
        private staticticsMonth: StaticticsForMonthEventListener,
        private staticticsYear: StaticticsForYearEventListener,
    ) {}

    public async HandleLogin(body: LoginDto): Promise<ReponseServiceDto>  {
        const userFound = await this.user.findBy({ filter:[{OR:[{email:body.param},{username:body.param}]}] });

        if(!userFound) {
            return {
                error: true,
                body: null,
                message: `User not found`
            }
        }
        const jwtPrimse = this.global.GenerateToken({ id:userFound.id });

        const match = this.global.Compare({ password:body.password, dbPassword:userFound.password });

        if(!match) {
            return {
                error: true,
                body: null,
                message: `Password not Match`
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
            message: `Unique user`
        }
    }    

    @OnEvent(`session`)
    private async ListenerSession() {}

}