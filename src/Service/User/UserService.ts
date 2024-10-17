import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { Prisma } from '@prisma/client';
import { currentSuperAdmin } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HistoryEventListener } from 'src/EventListener/HistoryEvent';
import { StaticticsForMonthEventListener } from 'src/EventListener/StaticticsForMonthEvent';
import { StaticticsForYearEventListener } from 'src/EventListener/StaticticsForYearEvent';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { ListenerService } from '../ListenerService';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { LanguajeService } from '../Translate/LanguajeService';
import { TranslateType } from 'src/Validation/Translate';

@Injectable()
export class UserService {

    private lang: TranslateType;

    constructor(
        private user: UserModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreateNewUser(body: Prisma.UserCreateInput): Promise<ReponseServiceDto>  {
        // validations
        const emailFoundPromise = this.user.findBy({ filter:[{ email:body.email }] });
        const usernameFoundPromise = this.user.findBy({ filter:[{ username:body.username }] });

        const emailFound = await emailFoundPromise;
        const usernameFound = await usernameFoundPromise;

        if(emailFound) {
            return { body: null, error: true, message: this.lang.User.EMAIL_FOUND }
        }

        if(usernameFound) {
            return { body: null, error: true, message: this.lang.User.USERNAME_FOUND }
        }

        const resultPromise = this.user.create({ data:body });
        const result = await resultPromise;

        const currentEvent: AbstractListenerEvent = {
            event:`create.user`,
            objectName:`user`,
        }
        const resultEvent = await this.event.emitAsync(`action.user`, currentEvent);

        return {
            body: {
                user: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   

    public async UpdateUser(id: string, body:Prisma.UserUpdateInput): Promise<ReponseServiceDto> {
        if(body.email) {
            const found = await this.user.findBy({ filter:[{ email:`${body.email}` },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:this.lang.User.EMAIL_FOUND }
        }

        if(body.username) {
            const found = await this.user.findBy({ filter:[{ username:`${body.username}` },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:this.lang.User.USERNAME_FOUND }
        }

        const result = await this.user.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.user`,
            id:result.id,
            objectName:`user`,
        }
        this.event.emit(`action.user`, currentEvent);

        return {
            body: { user:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindUser(id: string): Promise<ReponseServiceDto> {
        const found = await this.user.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllUser({ filter, skip, take}:{skip:number, take:number, filter: Prisma.UserWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.user.count({ filter });
        const listPromise = this.user.findAll({ filter, skip, take });

        const count = await countPromise;
        const list = await listPromise;
        
        return {
            body: {
                next: skip+take > count ? false : true,
                previous: count <= take ? false : true,
                nowSkip: skip+take,
                nowTake: take,
                list,
                count, 
            },
            error: false,
            message: this.lang.Action.GETTING
        }
    }
    
    public async DelteUser(id: string): Promise<ReponseServiceDto> {
        const result = this.user.softDelete({ id });
        await result;

        const currentEvent: AbstractListenerEvent = {
            event:`delete.user`,
            id:id,
            objectName:`user`,
        }
        this.event.emit(`action.user`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreUser(id: string): Promise<ReponseServiceDto> {
        const result = this.user.softRecover({ id });
        await result;

        const currentEvent: AbstractListenerEvent = {
            event:`recovery.user`,
            id:id,
            objectName:`user`,
        }
        this.event.emit(`action.user`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    }

    // event for recovery user
    @OnEvent(`action.user`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
