import { Injectable } from '@nestjs/common';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { Prisma } from '@prisma/client';
import { SubscriptionModel } from 'src/Model/M/Master/SubscriptionModel';
import { ListenerService } from '../ListenerService';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';

@Injectable()
export class SubscriptionService {

    private lang: TranslateType;

    constructor(
        private subscription: SubscriptionModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreateSubscription(body: Prisma.SubscriptionCreateInput, detail?: Prisma.SubscriptionDetailCreateInput[]): Promise<ReponseServiceDto>  {
        // validations
        const SubscriptionFoundPromise = this.subscription.findBy({ filter:[{ name:body.name }] });

        const SubscriptionFound = await SubscriptionFoundPromise;

        if(SubscriptionFound) {
            return { body: null, error: true, message: this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.subscription.create({ data:body });

        const result = await resultPromise;
        
        const currentEvent: AbstractListenerEvent = {
            event:`create.subscription`,
            id:result.id,
            objectName:`subscription`,
            user:result.createById
        }
        this.event.emit(`action.subscription`, currentEvent);

        if(detail) {
            detail.forEach(async (detail) =>  await this.subscription.createDetail({ name:detail.name,subscriptionReference:{connect:{id:result.id}} }));
        }

        return {
            body: {
                subscription: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   

    public async UpdateSubscription(id: string, body:Prisma.SubscriptionUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.subscription.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:`City in use` }
        }


        const result = await this.subscription.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.subscription`,
            id:result.id,
            objectName:`subscription`,
            user:result.createById
        }
        this.event.emit(`action.subscription`, currentEvent);

        return {
            body: { city:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindSubscription(id: string): Promise<ReponseServiceDto> {
        const found = await this.subscription.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllSubscription({filter, skip, take}:{skip:number, take:number, filter: Prisma.SubscriptionWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.subscription.count({ filter });
        const listPromise = this.subscription.findAll({ filter, skip, take });

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
    
    public async DelteSubscription(id: string): Promise<ReponseServiceDto> {
        const result = await this.subscription.softDelete({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`delete.Subscription`,
            id:result.id,
            objectName:`Subscription`,
            user:result.createById
        }
        this.event.emit(`action.Subscription`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreSubscription(id: string): Promise<ReponseServiceDto> {
        const result = await this.subscription.softRecover({ id });
        
        const currentEvent: AbstractListenerEvent = {
            event:`recovery.subscription`,
            id:result.id,
            objectName:`subscription`,
            user:result.createById
        }
        this.event.emit(`action.subscription`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    }   
    
    // event for recovery user
    @OnEvent(`action.subscription`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
