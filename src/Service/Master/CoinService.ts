import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { Coin, Prisma } from '@prisma/client';
import { currentSuperAdmin } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { CoinModel } from 'src/Model/M/Master/CoinModel';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerService } from '../ListenerService';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';
import { FORM } from 'src/Validation/UI/Form/GenericForm';

@Injectable()
export class CoinService {

    private lang: TranslateType;

    constructor(
        private coin: CoinModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreateCoin(body: Prisma.CoinCreateInput): Promise<ReponseServiceDto>  {
        // validations
        const coinFoundPromise = this.coin.findBy({ filter:[{ name:body.name }] });

        const coinFound = await coinFoundPromise;

        if(coinFound) {
            return { body: null, error: true, message: this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.coin.create({ data:body });

        const result = await resultPromise;
        

        const currentEvent: AbstractListenerEvent = {
            event:`create.coin`,
            id:result.id,
            objectName:`coin`,
            user:result.createById
        }
        this.event.emit(`action.coin`, currentEvent);

        return {
            body: {
                coin: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   

    public async UpdateCoin(id: string, body:Prisma.CoinUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.coin.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:`City in use` }
        }


        const result = await this.coin.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.coin`,
            id:result.id,
            objectName:`coin`,
            user:result.createById
        }
        this.event.emit(`action.coin`, currentEvent);

        return {
            body: { city:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindCoin(id: string): Promise<ReponseServiceDto> {
        const found = await this.coin.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllCoin({filter, skip, take}:{skip:number, take:number, filter: Prisma.CoinWhereInput[]}): Promise<ReponseServiceDto> {
        const count = await this.coin.count({ filter });

        const listPromise = this.coin.findAll({ filter, skip, take });

        const list = await listPromise;

        return {
            body: {
                next: skip+take > count ? false : true,
                previous: count < take ? false : true,
                nowSkip: skip+take,
                nowTake: take,
                list,
                count, 
            },
            error: false,
            message: this.lang.Action.GETTING
        }
    }
    
    public async DelteCoin(id: string): Promise<ReponseServiceDto> {
        const result = await this.coin.softDelete({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`delete.coin`,
            id:result.id,
            objectName:`coin`,
            user:result.createById
        }
        this.event.emit(`action.coin`, currentEvent);


        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreCoin(id: string): Promise<ReponseServiceDto> {
        const result = await this.coin.softRecover({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`recovery.coin`,
            id:result.id,
            objectName:`coin`,
            user:result.createById
        }
        this.event.emit(`action.coin`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    } 

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/coin/create`,
            name: this.lang.Titles.Form.create,
            fields: [
                {
                    id: `from.create.coin.name`,
                    key: `from.create.coin.name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }, {
                    id: `from.create.coin.prefix`,
                    key: `from.create.coin.prefix`,
                    label: this.lang.Input.prefix,
                    name: `prefix`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }, {
                    id: `from.create.coin.description`,
                    key: `from.create.coin.description`,
                    label: this.lang.Input.description,
                    name: `description`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: Coin) {
        const form: FORM = {
            method: `PUT`,
            path: `/coin/${data.id}/update`,
            name: this.lang.Titles.Form.update,
            fields: [
                {
                    id: `from.create.coin.name`,
                    key: `from.create.coin.name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.name
                }
            ]
        }
        return form;
    }

    public getFromDelete(id: string) {
        const form: FORM = {
            method: `PUT`,
            path: `/coin/${id}/delete`,
            name: this.lang.Titles.Form.delete,
            fields: [],
            delete: true
        }
        return form;
    }
    // event for recovery coin
    @OnEvent(`action.coin`)
    private async ListenerEvent(event: AbstractListenerEvent) {

        this.listener.Distpatch(event);
    }

}
