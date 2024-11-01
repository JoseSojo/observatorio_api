import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/Model/M/User/UserModel';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { Prisma } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ListenerService } from '../ListenerService';
import { AbstractListenerEvent } from 'src/Validation/Listener/AbstractListenerEvent';
import { LanguajeService } from '../Translate/LanguajeService';
import { TranslateType } from 'src/Validation/Translate';
import { FORM } from 'src/Validation/UI/Form/GenericForm';
import { GlobalService } from '../GlobalService';

@Injectable()
export class UserService {

    private lang: TranslateType;

    constructor(
        private user: UserModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService,
        private global: GlobalService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async CountUser ({filter}: {filter:Prisma.UserWhereInput[]}) {
        return this.user.count({ filter });
    }

    public async UpdatePassword({id,password}:{id:string,password:string}): Promise<ReponseServiceDto> {
        const result = this.user.update({
            data: { password:await this.global.Hash({ password }) },
            id
        });

        return { body:result, error:false,message:this.lang.Action.PASSWORD_CHANGE };
    }

    public async GenerateRestorePassword({id}:{id:string}): Promise<ReponseServiceDto> {
        const date = new Date();
        const token = await this.global.Hash({ password:id });
        const result = await this.UpdateUser(id, { passwordRequetsAt:date, passwordRequetsToken:token });

        return {
            body: await result,
            error: false,
            message: this.lang.Action.PASSWORD_REQUETS
        }
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
            const found = await this.user.findBy({ filter:[{ email:`${body.email}` },{ NOT:{id} }] });
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
            user: id
        }
        this.event.emit(`action.user`, currentEvent);

        return {
            body: { user:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindUser({filter}: {filter: Prisma.UserWhereInput[]}): Promise<ReponseServiceDto> {
        const found = await this.user.findBy({ filter });

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

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/user/create`,
            name: this.lang.Titles.Form.create,
            fields: [
                {
                    id: `from.create.user.name`,
                    key: `from.create.user.name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }, {
                    id: `from.create.user.lastname`,
                    key: `from.create.user.lastname`,
                    label: this.lang.Input.lastname,
                    name: `lastname`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }, {
                    id: `from.create.user.username`,
                    key: `from.create.user.username`,
                    label: this.lang.Input.username,
                    name: `username`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }, {
                    id: `from.create.user.email`,
                    key: `from.create.user.email`,
                    label: this.lang.Input.email,
                    name: `email`,
                    placeholder: ``,
                    required: true,
                    type: `email`
                }, {
                    id: `from.create.user.password`,
                    key: `from.create.user.password`,
                    label: this.lang.Input.password,
                    name: `password`,
                    placeholder: ``,
                    required: true,
                    type: `password`
                }, {
                    key: `user.create.data.city`,
                    id: `cityId`,
                    label: this.lang.Input.city,
                    name: `cityId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: ``,
                    select: true,
                    selectIn: `city`
                }, {
                    key: `user.create.data.permit`,
                    id: `roleId`,
                    label: this.lang.Input.permit,
                    name: `roleId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: ``,
                    select: true,
                    selectIn: `permit`
                }
            ]
        }
        return form;
    }

    public getFormUpdate() {
        const form: FORM = {
            method: `PUT`,
            path: `/user/---/update`,
            name: this.lang.Titles.Form.create,
            fields: [
                {
                    id: `from.update.user.name`,
                    key: `from.update.user.name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`
                }
            ]
        }
        return form;
    }

    public getFromDelete(id: string) {
        const form: FORM = {
            method: `PUT`,
            path: `/user/${id}/delete`,
            name: this.lang.Titles.Form.delete,
            fields: [],
            delete: true
        }
        return form;
    }

    // event for recovery user
    @OnEvent(`action.user`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
