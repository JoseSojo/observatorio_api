import { Injectable } from '@nestjs/common';
import { Prisma, ConfigLanguaje } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class LanguajeModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.ConfigLanguajeCreateInput}): Promise<ConfigLanguaje | null> {
        return this.prisma.configLanguaje.create({ data:{...data, label:data.label.toLocaleUpperCase(), payload:data.payload.toLocaleUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.ConfigLanguajeWhereInput[]}): Promise<ConfigLanguaje | null> {
        return this.prisma.configLanguaje.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async count({filter}:{filter: Prisma.ConfigLanguajeWhereInput[]}): Promise<number> {
        return this.prisma.configLanguaje.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.ConfigLanguajeWhereInput[], order?: Prisma.ConfigLanguajeOrderByWithAggregationInput}
    ): Promise<ConfigLanguaje[] | null> {
        return this.prisma.configLanguaje.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.ConfigLanguajeUpdateInput }): Promise<ConfigLanguaje | null> {
        return this.prisma.configLanguaje.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<ConfigLanguaje | null> {
        return this.prisma.configLanguaje.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<ConfigLanguaje | null> {
        return this.prisma.configLanguaje.update({ where:{id}, data:{ isDelete:false } });
    }
}