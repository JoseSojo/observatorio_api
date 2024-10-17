import { Injectable } from '@nestjs/common';
import { Prisma, Subscription, SubscriptionDetail } from '@prisma/client';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class SubscriptionModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.SubscriptionCreateInput}): Promise<Subscription | null> {
        return this.prisma.subscription.create({ data:{...data,name:data.name.toLocaleUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.SubscriptionWhereInput[]}): Promise<Subscription | null> {
        return this.prisma.subscription.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
            include: {
                _count: true,
                createByReference: true,
                details: true,
            }
        })
    }

    public async count({filter}:{filter: Prisma.SubscriptionWhereInput[]}): Promise<number> {
        return this.prisma.subscription.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.SubscriptionWhereInput[], order?: Prisma.SubscriptionOrderByWithAggregationInput}
    ): Promise<Subscription[] | null> {
        return this.prisma.subscription.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            include: {
                _count: true,
                createByReference: { select:{ name:true,lastname:true,rolReference:{select:{name:true}} } },
                details: { where:{isDelete:false} }
            },
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.SubscriptionUpdateInput }): Promise<Subscription | null> {
        return this.prisma.subscription.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<Subscription | null> {
        return this.prisma.subscription.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<Subscription | null> {
        return this.prisma.subscription.update({ where:{id}, data:{ isDelete:false } });
    }

    public async createDetail(data: Prisma.SubscriptionDetailCreateInput): Promise<SubscriptionDetail | null> {
        return this.prisma.subscriptionDetail.create({ data });
    }

    public async updateDetail({ id, data }: { id:string, data:Prisma.SubscriptionDetailUpdateInput }): Promise<SubscriptionDetail | null> {
        return this.prisma.subscriptionDetail.update({ where:{id}, data });
    }

    public async softDeleteDetail({ id }: { id:string }): Promise<SubscriptionDetail | null> {
        return this.prisma.subscriptionDetail.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecoverDetail({ id }: { id:string }): Promise<SubscriptionDetail | null> {
        return this.prisma.subscriptionDetail.update({ where:{id}, data:{ isDelete:false } });
    }
}