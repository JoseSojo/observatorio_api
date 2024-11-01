import { Injectable } from '@nestjs/common';
import { Prisma, Coin } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class CoinModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.CoinCreateInput}): Promise<Coin | null> {
        return this.prisma.coin.create({ data:{...data,name:data.name.toUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.CoinWhereInput[]}): Promise<Coin | null> {
        return this.prisma.coin.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
            include: {
                _count: true,
                createByReference: true,
            }
        })
    }

    public async count({filter}:{filter: Prisma.CoinWhereInput[]}): Promise<number> {
        return this.prisma.coin.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.CoinWhereInput[], order?: Prisma.CoinOrderByWithAggregationInput}
    ): Promise<Coin[] | null> {
        return this.prisma.coin.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            include: {
                _count: true,
                country: true,
                createByReference: true
            },
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.CoinUpdateInput }): Promise<Coin | null> {
        return this.prisma.coin.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<Coin | null> {
        return this.prisma.coin.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<Coin | null> {
        return this.prisma.coin.update({ where:{id}, data:{ isDelete:false } });
    }
}