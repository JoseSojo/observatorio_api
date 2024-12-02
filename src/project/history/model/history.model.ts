import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class HistotyProjectModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.historyProjectCreateInput}) {
        const result = this.prisma.historyProject.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.historyProjectWhereInput, select?:Prisma.historyProjectSelect }) {
        const result = this.prisma.historyProject.findMany({ 
            skip, 
            take, 
            where: filter, 
            select: {
                id: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                eventName: true,
                userAuth: true,
                userId: true,
                userRef: true,
                projectId: true,
                projectRef: true,
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.historyProjectWhereInput, select?:Prisma.historyProjectSelect }) {
        const result = this.prisma.historyProject.findFirst({ 
            where: filter, 
            select: select ? select : {
                id: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                eventName: true,
                userAuth: true,
                userId: true,
                userRef: true,
                projectRef: true,
                projectId: true
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.historyProjectWhereInput }) {
        const result = this.prisma.historyProject.count({ 
            where: filter,
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.historyProjectWhereUniqueInput, data: Prisma.historyProjectUpdateInput}) {
        const result = this.prisma.historyProject.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.historyProject.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.historyProject.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
