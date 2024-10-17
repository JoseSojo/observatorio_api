import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Service/PrismaService';
import { History } from 'src/Validation/Listener/HistoryEvent';


@Injectable()
export class HistoryModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async Create(data: History) {
        return this.prisma.history.create({
            data:{
                eventName:data.event,
                objectName:data.name,
                objectReferenceId:data.id
            }
        });
    }

}