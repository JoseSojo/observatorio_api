import { Injectable } from '@nestjs/common';
import { Prisma, Permits } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class PermitsModel {

    constructor(
        private prisma: PrismaService,
        private global: GlobalService
    ) {}

    public async create({name, roles,userId}: {name:string, roles:string[],userId?:string}): Promise<Permits | null> {

        if(userId) return this.prisma.permits.create({ 
            data: {
                name,
                roles,
                createByReference: {
                    connect: { id:userId }
                }
            }
        });

        return this.prisma.permits.create({ 
            data: {
                name,
                roles,

            }
        });
    }

    public async findBy({filter}:{filter: Prisma.PermitsWhereInput[]}): Promise<Permits | null> {
        return this.prisma.permits.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
            include: {
                _count: true,
                createByReference: true,
            }
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.PermitsWhereInput[], order?: Prisma.PermitsOrderByWithAggregationInput}
    ): Promise<Permits[] | null> {
        return this.prisma.permits.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            include: {
                _count: true,
                createByReference: true,
            },
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async count({filter}: {filter:Prisma.PermitsWhereInput[]}) {
        return this.prisma.permits.count({ where:{AND:[...filter,{isDelete:false}]} });
    }

    public async update({ id, data }: { id:string, data:Prisma.PermitsUpdateInput }): Promise<Permits | null> {
        return this.prisma.permits.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<Permits | null> {
        return this.prisma.permits.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<Permits | null> {
        return this.prisma.permits.update({ where:{id}, data:{ isDelete:false } });
    }
}