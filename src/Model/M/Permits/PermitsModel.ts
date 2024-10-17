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

    public async create({name, roles,userid}: {name:string, roles:any,userid?:string}): Promise<Permits | null> {
        if(userid) return this.prisma.permits.create({ 
            data: {
                name,
                roles,
                createByReference: {
                    connect: { id:userid }
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
            where: { AND:[...filter, {isDelete:false}] }
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.PermitsWhereInput[], order?: Prisma.PermitsOrderByWithAggregationInput}
    ): Promise<Permits[] | null> {
        return this.prisma.permits.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
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