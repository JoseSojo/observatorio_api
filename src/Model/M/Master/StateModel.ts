import { Injectable } from '@nestjs/common';
import { Prisma, ConfigState } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class ConfigStateModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.ConfigStateCreateInput}): Promise<ConfigState | null> {
        return this.prisma.configState.create({ data:{...data,name:data.name.toUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.ConfigStateWhereInput[]}): Promise<ConfigState | null> {
        return this.prisma.configState.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async count({filter}:{filter: Prisma.ConfigStateWhereInput[]}): Promise<number> {
        return this.prisma.configState.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.ConfigStateWhereInput[], order?: Prisma.ConfigStateOrderByWithAggregationInput}
    ): Promise<ConfigState[] | null> {
        return this.prisma.configState.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.ConfigStateUpdateInput }): Promise<ConfigState | null> {
        return this.prisma.configState.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<ConfigState | null> {
        return this.prisma.configState.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<ConfigState | null> {
        return this.prisma.configState.update({ where:{id}, data:{ isDelete:false } });
    }
}