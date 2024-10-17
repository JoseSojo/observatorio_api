import { Injectable } from '@nestjs/common';
import { Prisma, ConfigCountry } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class ConfigCountryModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.ConfigCountryCreateInput}): Promise<ConfigCountry | null> {
        return this.prisma.configCountry.create({ data:{...data,name:data.name.toLocaleUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.ConfigCountryWhereInput[]}): Promise<ConfigCountry | null> {
        return this.prisma.configCountry.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async count({filter}:{filter: Prisma.ConfigCountryWhereInput[]}): Promise<number> {
        return this.prisma.configCountry.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.ConfigCountryWhereInput[], order?: Prisma.ConfigCountryOrderByWithAggregationInput}
    ): Promise<ConfigCountry[] | null> {
        return this.prisma.configCountry.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.ConfigCountryUpdateInput }): Promise<ConfigCountry | null> {
        return this.prisma.configCountry.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<ConfigCountry | null> {
        return this.prisma.configCountry.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<ConfigCountry | null> {
        return this.prisma.configCountry.update({ where:{id}, data:{ isDelete:false } });
    }
}