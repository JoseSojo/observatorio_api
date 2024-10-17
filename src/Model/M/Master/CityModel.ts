import { Injectable } from '@nestjs/common';
import { Prisma, ConfigCity } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class ConfigCityModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.ConfigCityCreateInput}): Promise<ConfigCity | null> {
        return this.prisma.configCity.create({ data:{...data,name:data.name.toLocaleUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.ConfigCityWhereInput[]}): Promise<ConfigCity | null> {
        return this.prisma.configCity.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async count({filter}:{filter: Prisma.ConfigCityWhereInput[]}): Promise<number> {
        return this.prisma.configCity.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.ConfigCityWhereInput[], order?: Prisma.ConfigCityOrderByWithAggregationInput}
    ): Promise<ConfigCity[] | null> {
        return this.prisma.configCity.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.ConfigCityUpdateInput }): Promise<ConfigCity | null> {
        return this.prisma.configCity.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<ConfigCity | null> {
        return this.prisma.configCity.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<ConfigCity | null> {
        return this.prisma.configCity.update({ where:{id}, data:{ isDelete:false } });
    }
}