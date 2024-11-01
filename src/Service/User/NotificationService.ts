import { Injectable } from '@nestjs/common';
import { NotificationModel } from 'src/Model/M/User/NotificationModel';
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
export class NotificationService {

    private lang: TranslateType;

    constructor(
        private notification: NotificationModel,
        private event: EventEmitter2,
        private listener: ListenerService,
        private translate: LanguajeService,
        private global: GlobalService
    ) {
        this.lang = this.translate.GetTranslate()
    }
    
    public async CreateNewNotification(body: Prisma.NotificationCreateInput): Promise<ReponseServiceDto>  {

        const resultPromise = this.notification.create({ data:body });
        const result = await resultPromise;

        const currentEvent: AbstractListenerEvent = {
            event:`create.notification`,
            objectName:`notification`,
        }
        const resultEvent = await this.event.emitAsync(`action.notification`, currentEvent);

        return {
            body: {
                Notification: result
            },
            error: false,
            message: this.lang.Action.CREATE
        }
    }   

    public async UpdateNotification(id: string, body:Prisma.UserUpdateInput): Promise<ReponseServiceDto> {
        const result = await this.notification.update({ id, data:body });

        const currentEvent: AbstractListenerEvent = {
            event:`update.notification`,
            id:result.id,
            objectName:`notification`,
            user: id
        }
        this.event.emit(`action.notification`, currentEvent);

        return {
            body: { user:result },
            error: false,
            message: this.lang.Action.UDPATE
        }
    }

    public async FindNotification({filter}: {filter: Prisma.NotificationWhereInput[]}): Promise<ReponseServiceDto> {
        const found = await this.notification.findBy({ filter });

        return {
            body: found ? found : null,
            error: found ? false : true,
            message: found ? this.lang.Action.FIND : this.lang.Action.NOT_FOUND
        }

    }
    
    public async FindAllNotification({ filter, skip, take}:{skip:number, take:number, filter: Prisma.NotificationWhereInput[]}): Promise<ReponseServiceDto> {
        
        const countPromise = this.notification.count({ filter });
        const listPromise = this.notification.findAll({ filter, skip, take });

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
    
    public async DelteNotification(id: string): Promise<ReponseServiceDto> {
        const result = this.notification.softDelete({ id });
        await result;

        const currentEvent: AbstractListenerEvent = {
            event:`delete.notification`,
            id:id,
            objectName:`notification`,
        }
        this.event.emit(`action.notification`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.DELETE,
            error: false,
        }
    }

    public async RestoreNotification(id: string): Promise<ReponseServiceDto> {
        const result = this.notification.softRecover({ id });
        await result;

        const currentEvent: AbstractListenerEvent = {
            event:`recovery.notification`,
            id:id,
            objectName:`notification`,
        }
        this.event.emit(`action.notification`, currentEvent);

        return {
            body: null,
            message: this.lang.Action.RECOVERY,
            error: false,
        }
    }

    // event for recovery Notification
    @OnEvent(`action.notification`)
    private async ListenerEvent(event: AbstractListenerEvent) {
        this.listener.Distpatch(event);
    }
}
