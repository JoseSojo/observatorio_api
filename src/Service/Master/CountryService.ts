import { Injectable } from '@nestjs/common';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { Prisma } from '@prisma/client';
import { ConfigCountryModel } from 'src/Model/M/Master/CountryModel';
import { ListenerService } from '../ListenerService';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';

@Injectable()
export class ConfigCountryService {

    private lang: TranslateType;

    constructor(
        private country: ConfigCountryModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreateCountry(body: Prisma.ConfigCountryCreateInput): Promise<ReponseServiceDto>  {
        // validations
        const countryFoundPromise = this.country.findBy({ filter:[{ name:body.name }] });

        const countryFound = await countryFoundPromise;

        if(countryFound) {
            return { body: null, error: true, message: this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.country.create({ data:body });

        // emit statictic and history

        const result = await resultPromise;
        
        const currentEvent: AbstractListenerEvent = {
            event:`create.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.country`, currentEvent);

        return {
            body: {
                country: result
            },
            error: false,
            message: `Country Create`
        }
    }   

    public async UpdateConfigCountry(id: string, body:Prisma.ConfigCountryUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.country.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:`City in use` }
        }


        const result = await this.country.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.country`, currentEvent);

        return {
            body: { city:result },
            error: false,
            message: `City actualizado`
        }
    }

    public async FindConfigCountry(id: string): Promise<ReponseServiceDto> {
        const found = await this.country.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? `Unique city` : `city not found`
        }

    }
    
    public async FindAllConfigCountry({filter, skip, take}:{skip:number, take:number, filter: Prisma.ConfigCountryWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.country.count({ filter });
        const listPromise = this.country.findAll({ filter, skip, take });

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
            message: `Lista de ConfigCountrys`
        }
    }
    
    public async DelteConfigCountry(id: string): Promise<ReponseServiceDto> {
        const result = await this.country.softDelete({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`delete.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.country`, currentEvent);

        return {
            body: null,
            message: `ConfigCountry delete`,
            error: false,
        }
    }

    public async RestoreConfigCountry(id: string): Promise<ReponseServiceDto> {
        const result = await this.country.softRecover({ id });
        
        const currentEvent: AbstractListenerEvent = {
            event:`recovery.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.country`, currentEvent);

        return {
            body: null,
            message: `ConfigCountry recovery`,
            error: false,
        }
    }   
    
    // event for recovery user
    @OnEvent(`action.country`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
