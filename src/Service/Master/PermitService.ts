import { Injectable } from '@nestjs/common';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { Permits, Prisma } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerService } from '../ListenerService';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { TranslateType } from 'src/Validation/Translate';
import { LanguajeService } from '../Translate/LanguajeService';
import { FORM } from 'src/Validation/UI/Form/GenericForm';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { PermitsFactory } from 'src/Factory/PermitsFactory';

@Injectable()
export class PermitService {

    private lang: TranslateType;

    constructor(
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService,
        private permit: PermitsModel,
        private permitFactory: PermitsFactory
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CreatePermit(body: {name:string, roles:string[], userId:string}): Promise<ReponseServiceDto>  {
        // validations
        const permitFoundPromise = this.permit.findBy({ filter:[{ name:body.name }] });

        const permitFound = await permitFoundPromise;

        if(permitFound) {
            return { body: null, error: true, message: this.lang.Action.NOW_EXIST }
        }

        const resultPromise = this.permit.create({ ...body });
        const result = await resultPromise;
        
        const currentEvent: AbstractListenerEvent = {
            event:`create.permit`,
            id:result.id,
            objectName:`permit`,
            user:result.createById
        }
        this.event.emit(`action.permit`, currentEvent);

        return {
            body: {
                Permit: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   
    
    public async UpdateConfigPermit(id: string, body:Prisma.PermitsUpdateInput): Promise<ReponseServiceDto> {
        if(body.name) {
            const found = await this.permit.findBy({ filter:[{ name:`${body.name}`.toUpperCase() },{id:{notIn:[id]}}] });
            if(found) return { body:null,error:true,message:`Permit in use` }
        }

        const result = await this.permit.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.permit`,
            id:result.id,
            objectName:`permit`,
            user:result.createById
        }
        this.event.emit(`action.permit`, currentEvent);

        return {
            body: { Permit:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindConfigPermit(id: string): Promise<ReponseServiceDto> {
        const found = await this.permit.findBy({ filter:[{id}] });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllConfigPermit({filter, skip, take}:{skip:number, take:number, filter: Prisma.PermitsWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.permit.count({ filter });
        const listPromise = this.permit.findAll({ filter, skip, take });

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
    
    public async DelteConfigPermit(id: string): Promise<ReponseServiceDto> {
        const result = await this.permit.softDelete({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`delete.permit`,
            id:id,
            objectName:`Permit`,
            user:result.createById
        }
        this.event.emit(`action.permit`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreConfigPermit(id: string): Promise<ReponseServiceDto> {
        const result = await this.permit.softRecover({ id });

        const currentEvent: AbstractListenerEvent = {
            event:`recovery.permit`,
            id:id,
            objectName:`Permit`,
            user:result.createById
        }
        this.event.emit(`action.permit`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    }

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/Permit/create`,
            name: this.lang.Titles.Form.create,
            fields: [
                {
                    id: `from.create.permit.name`,
                    key: `from.create.permit.name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                },
                {
                    id: `from.create.permit.permits`,
                    key: `from.create.permit.permits`,
                    label: this.lang.Input.permit,
                    name: `permits`,
                    placeholder: ``,
                    type: `text`,
                    required: true,
                    check: true,
                    childs: [...this.permitFactory.getPermitCRUD(), ...this.permitFactory.getAbstractPermitDefault(), ...this.permitFactory.getPermitStaticticsPie()]
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: Permits) {
        const form: FORM = {
            method: `PUT`,
            path: `/permit/${data.id}/update`,
            name: this.lang.Titles.Form.update,
            fields: [
                {
                    id: `from.create.permit.name`,
                    key: `from.create.permit.name`,
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
            path: `/permit/${id}/delete`,
            name: this.lang.Titles.Form.delete,
            fields: [],
            delete: true
        }
        return form;
    }

    // event for recovery user
    @OnEvent(`action.permit`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
