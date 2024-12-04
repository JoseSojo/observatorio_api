import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class HistoryModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.historyCreateInput}) {
        const result = this.prisma.history.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.historyWhereInput, select?:Prisma.historySelect }) {
        const result = await this.prisma.history.findMany({ 
            skip, 
            take, 
            where: filter, 
            select: {
                id: true,
                createAt: true,
                browser: true,
                eventName: true,
                ip: true,
                objectName: true,
                objectId: true,
                objectReference: true,
                userId: true,
            }
        });

        const newHistory: any[] = [];

        result.forEach(async (history) => {
            const userFound = await this.prisma.user.findFirst({ where:{id:history.userId} });
            newHistory.push({...history, userReference: userFound})
        });

        return newHistory;
    }

    public async find({ filter, select }: { filter?:Prisma.historyWhereInput, select?:Prisma.historySelect }) {
        const result = this.prisma.history.findFirst({ 
            where: filter, 
            select: select ? select : {
                id: true,
                createAt: true,
                browser: true,
                eventName: true,
                ip: true,
                objectName: true,
                objectId: true,
                objectReference: true
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.historyWhereInput }) {
        const result = this.prisma.history.count({ 
            where: filter,
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.historyWhereUniqueInput, data: Prisma.historyUpdateInput}) {
        const result = this.prisma.history.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }
}
