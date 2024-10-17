import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class SessionModel {

    constructor(
        private prisma: PrismaService,
        private global: GlobalService
    ) {}

    public async count({filter}: { filter:Prisma.SessionWhereInput[] }): Promise<number> {
        return this.prisma.session.count({ where:{AND:[...filter]} });
    }

    public async create({data}: {data: Prisma.SessionCreateInput}): Promise<Session | null> {
        return this.prisma.session.create({ 
            data: {
                ...data,
            }
        });
    }

    public async findBy({filter}:{filter: Prisma.SessionWhereInput[]}): Promise<Session | null> {
        return this.prisma.session.findFirst({ 
            where: { AND:[...filter] },
            include: {
                userReference: true
            }
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.SessionWhereInput[], order?: Prisma.SessionOrderByWithAggregationInput}
    ): Promise<Session[] | null> {
        return this.prisma.session.findMany({ 
            where:{ AND:[...filter], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.SessionUpdateInput }): Promise<Session | null> {
        return this.prisma.session.update({ where:{id}, data });
    }
}