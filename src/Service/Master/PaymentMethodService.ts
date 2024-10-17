import { Injectable } from '@nestjs/common';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { Prisma } from '@prisma/client';
import { PaymentMethodModel } from 'src/Model/M/Master/PaymentMethodModel';
import { ListenerService } from '../ListenerService';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';

@Injectable()
export class PaymentMethodService {

    private lang: TranslateType;

    constructor(
        private payment: PaymentMethodModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreatePaymentMethod(body: Prisma.PaymentMethodCreateInput): Promise<ReponseServiceDto>  {
        // validations
        const paymentFoundPromise = this.payment.findBy({ filter:[{ name:body.name }] });

        const paymentFound = await paymentFoundPromise;

        if(paymentFound) {
            return { body: null, error: true, message:this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.payment.create({ data:body });

        // emit statictic and history

        const result = await resultPromise;
        
        const currentEvent: AbstractListenerEvent = {
            event:`create.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.payment.method`, currentEvent);

        return {
            body: {
                user: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   

    public async UpdatePaymentMethod(id: string, body:Prisma.PaymentMethodUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.payment.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:this.lang.Action.NOW_EXIST }
        }

        const result = await this.payment.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.payment.method`, currentEvent);

        return {
            body: { city:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindPaymentMethod(id: string):  Promise<ReponseServiceDto> {
        const found = await this.payment.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllPaymentMethod({filter, skip, take}:{skip:number, take:number, filter: Prisma.PaymentMethodWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.payment.count({ filter });
        const listPromise = this.payment.findAll({ filter, skip, take });

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
    
    public async DeltePaymentMethod(id: string): Promise<ReponseServiceDto> {
        const result = await this.payment.softDelete({ id });
        
        const currentEvent: AbstractListenerEvent = {
            event:`delete.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.payment.method`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestorePaymentMethod(id: string): Promise<ReponseServiceDto> {
        const result = await this.payment.softRecover({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`recovery.country`,
            id:result.id,
            objectName:`country`,
            user:result.createById
        }
        this.event.emit(`action.payment.method`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    } 

    // event for recovery user
    @OnEvent(`action.payment.method`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
    
}
