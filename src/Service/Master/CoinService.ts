import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { Prisma } from '@prisma/client';
import { currentSuperAdmin } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { CoinModel } from 'src/Model/M/Master/CoinModel';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerService } from '../ListenerService';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';

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
        
        const countPromise = this.coin.count({ filter });
        const listPromise = this.coin.findAll({ filter, skip, take });

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

    // event for recovery coin
    @OnEvent(`action.coin`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }

}
