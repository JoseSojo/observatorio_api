import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

    public async findAll({filter,skip,take}: {filter:Prisma.HistoryWhereInput, skip:number,take:number}) {
        return this.prisma.history.findMany({
            where: filter,
            skip,
            take
        })
    }

    public async count({filter}: {filter:Prisma.HistoryWhereInput}) {
        return this.prisma.history.count({
            where: filter,
        })
    }

}