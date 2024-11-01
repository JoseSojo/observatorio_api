import { Injectable } from '@nestjs/common';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { Prisma } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TranslateType } from 'src/Validation/Translate';
import { ListenerService } from './ListenerService';
import { LanguajeService } from './Translate/LanguajeService';
import { HistoryModel } from 'src/Model/S/HistoryModel';

@Injectable()
export class HistoryService {

    private lang: TranslateType;

    constructor(
        private History: HistoryModel,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    public async FindAllConfigHistory({filter, skip, take}:{skip:number, take:number, filter: Prisma.HistoryWhereInput}): Promise<ReponseServiceDto> {
        
        const countPromise = this.History.count({ filter });
        const listPromise = this.History.findAll({ filter, skip, take });

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
}
