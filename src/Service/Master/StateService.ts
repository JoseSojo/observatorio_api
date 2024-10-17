import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { Prisma } from '@prisma/client';
import { currentSuperAdmin } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { ConfigStateModel } from 'src/Model/M/Master/StateModel';
import { ListenerService } from '../ListenerService';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';

@Injectable()
export class StateService {

    private lang: TranslateType;

    constructor(
        private state: ConfigStateModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreateState(body: Prisma.ConfigStateCreateInput): Promise<ReponseServiceDto>  {
        // validations
        const coinFoundPromise = this.state.findBy({ filter:[{ name:body.name }] });

        const coinFound = await coinFoundPromise;

        if(coinFound) {
            return { body: null, error: true, message: this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.state.create({ data:body });

        const result = await resultPromise;
        
        const currentEvent: AbstractListenerEvent = {
            event:`create.state`,
            id:result.id,
            objectName:`state`,
            user:result.createById,
            country:result.countryId
        }
        this.event.emit(`action.state`, currentEvent);

        return {
            body: {
                state: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   

    public async UpdateConfigState(id: string, body:Prisma.ConfigStateUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.state.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:`City in use` }
        }

        const result = await this.state.update({ id, data:body });
        
        const currentEvent: AbstractListenerEvent = {
            event:`update.state`,
            id:result.id,
            objectName:`state`,
            user:result.createById,
            country:result.countryId
        }
        this.event.emit(`action.state`, currentEvent);

        return {
            body: { city:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindConfigState(id: string): Promise<ReponseServiceDto> {
        const found = await this.state.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllConfigState({filter, skip, take}:{skip:number, take:number, filter: Prisma.ConfigStateWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.state.count({ filter });
        const listPromise = this.state.findAll({ filter, skip, take });

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
    
    public async DelteConfigState(id: string): Promise<ReponseServiceDto> {
        const result = await this.state.softDelete({ id });
        
        const currentEvent: AbstractListenerEvent = {
            event:`delete.state`,
            id:result.id,
            objectName:`state`,
            user:result.createById,
            country:result.countryId
        }
        this.event.emit(`action.state`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreConfigState(id: string): Promise<ReponseServiceDto> {
        const result = await this.state.softRecover({ id });
        
        const currentEvent: AbstractListenerEvent = {
            event:`recovery.state`,
            id:result.id,
            objectName:`state`,
            user:result.createById,
            country:result.countryId
        }
        this.event.emit(`action.payment.method`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    }   
    
    // event for recovery user
    @OnEvent(`action.state`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
