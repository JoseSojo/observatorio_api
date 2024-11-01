import { Injectable } from '@nestjs/common';
import { Prisma, PaymentMethod } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class PaymentMethodModel {

    constructor(
        private prisma: PrismaService
    ) {}

    public async create({data}: {data: Prisma.PaymentMethodCreateInput}): Promise<PaymentMethod | null> {
        return this.prisma.paymentMethod.create({ data:{...data,name:data.name.toLocaleUpperCase()} });
    }

    public async findBy({filter}:{filter: Prisma.PaymentMethodWhereInput[]}): Promise<PaymentMethod | null> {
        return this.prisma.paymentMethod.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
            include: {
                createByReference: true,
                moneyReference: true
            }
        })
    }

    public async count({filter}:{filter: Prisma.PaymentMethodWhereInput[]}): Promise<number> {
        return this.prisma.paymentMethod.count({ 
            where: { AND:[...filter, {isDelete:false}] },
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.PaymentMethodWhereInput[], order?: Prisma.PaymentMethodOrderByWithAggregationInput}
    ): Promise<PaymentMethod[] | null> {
        return this.prisma.paymentMethod.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            include: {
                moneyReference: true,
                createByReference: true
            },
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.PaymentMethodUpdateInput }): Promise<PaymentMethod | null> {
        return this.prisma.paymentMethod.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<PaymentMethod | null> {
        return this.prisma.paymentMethod.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<PaymentMethod | null> {
        return this.prisma.paymentMethod.update({ where:{id}, data:{ isDelete:false } });
    }
}