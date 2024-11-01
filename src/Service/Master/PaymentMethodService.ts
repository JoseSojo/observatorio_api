import { Injectable } from '@nestjs/common';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { PaymentMethod, Prisma } from '@prisma/client';
import { PaymentMethodModel } from 'src/Model/M/Master/PaymentMethodModel';
import { ListenerService } from '../ListenerService';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerPayloadHistory } from 'src/Validation/Listener/ListenerEvent';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';
import { FORM } from 'src/Validation/UI/Form/GenericForm';

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
            event:`create.payment`,
            id:result.id,
            objectName:`payment`,
            user:result.createById
        }
        this.event.emit(`action.payment.method`, currentEvent);

        return {
            body: {
                payment: result
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

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/payment/create`,
            name: this.lang.Titles.Form.create,
            fields: [
                {
                    id: `from.create.payment.name`,
                    key: `from.create.payment.name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }, {
                    id: `from.create.payment.coinId`,
                    key: `from.create.payment.coinId`,
                    label: this.lang.Input.coin,
                    name: `coinId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    select: true,
                    selectIn: `coin`
                }, {
                    id: `from.create.payment.description`,
                    key: `from.create.payment.description`,
                    label: this.lang.Input.description,
                    name: `description`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: PaymentMethod) {
        const form: FORM = {
            method: `PUT`,
            path: `/payment/${data.id}/update`,
            name: this.lang.Titles.Form.update,
            fields: [
                {
                    id: `from.create.payment.name`,
                    key: `from.create.payment.name`,
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
            path: `/payment/${id}/delete`,
            name: this.lang.Titles.Form.delete,
            fields: [],
            delete: true
        }
        return form;
    }

    // event for recovery user
    @OnEvent(`action.payment.method`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
    
}
