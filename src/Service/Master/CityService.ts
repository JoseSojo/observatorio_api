import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { Prisma } from '@prisma/client';
import { currentSuperAdmin } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { CoinModel } from 'src/Model/M/Master/CoinModel';
import { ConfigCityModel } from 'src/Model/M/Master/CityModel';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HistoryEventListener } from 'src/EventListener/HistoryEvent';
import { StaticticsForMonthEventListener } from 'src/EventListener/StaticticsForMonthEvent';
import { StaticticsForYearEventListener } from 'src/EventListener/StaticticsForYearEvent';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { ListenerService } from '../ListenerService';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';

@Injectable()
export class CityService {

    private lang: TranslateType;

    constructor(
        private city: ConfigCityModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreateCity(body: Prisma.ConfigCityCreateInput): Promise<ReponseServiceDto>  {
        // validations
        const coinFoundPromise = this.city.findBy({ filter:[{ name:body.name }] });

        const coinFound = await coinFoundPromise;

        if(coinFound) {
            return { body: null, error: true, message: this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.city.create({ data:body });

        const result = await resultPromise;
        
        const currentEvent: AbstractListenerEvent = {
            event:`create.city`,
            id:result.id,
            objectName:`city`,
            user:result.createById
        }
        this.event.emit(`action.city`, currentEvent);

        return {
            body: {
                city: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   
    
    public async UpdateConfigCity(id: string, body:Prisma.ConfigCityUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.city.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:`City in use` }
        }

        const result = await this.city.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.city`,
            id:result.id,
            objectName:`city`,
            user:result.createById
        }
        this.event.emit(`action.city`, currentEvent);

        return {
            body: { city:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindConfigCity(id: string): Promise<ReponseServiceDto> {
        const found = await this.city.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllConfigCity({filter, skip, take}:{skip:number, take:number, filter: Prisma.ConfigCityWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.city.count({ filter });
        const listPromise = this.city.findAll({ filter, skip, take });

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
    
    public async DelteConfigCity(id: string): Promise<ReponseServiceDto> {
        const result = await this.city.softDelete({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`delete.city`,
            id:id,
            objectName:`city`,
            user:result.createById
        }
        this.event.emit(`action.city`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreConfigCity(id: string): Promise<ReponseServiceDto> {
        const result = await this.city.softRecover({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`recovery.city`,
            id:id,
            objectName:`city`,
            user:result.createById
        }
        this.event.emit(`action.city`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    }

    // event for recovery user
    @OnEvent(`action.city`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
