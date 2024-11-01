import { Injectable } from '@nestjs/common';
import { Notification, Prisma, User } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class NotificationModel {

    constructor(
        private prisma: PrismaService,
        private global: GlobalService
    ) {}

    public async count({filter}: { filter:Prisma.NotificationWhereInput[] }): Promise<number> {
        return this.prisma.notification.count({ where:{AND:[...filter, {isDelete:false}]} });
    }

    public async create({data}: {data: Prisma.NotificationCreateInput}) {
        return this.prisma.notification.create({ 
            data: {
                ...data,
            },
            include:{
                userByReference: true,
                userForReference: true,
            }
        });
    }

    public async findBy({filter}:{filter: Prisma.NotificationWhereInput[]}): Promise<Notification | null> {
        return this.prisma.notification.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
            include: {
                userByReference: true,
                userForReference: true
            }
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.NotificationWhereInput[], order?: Prisma.NotificationOrderByWithRelationInput}
    ) {
        return this.prisma.notification.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
            include: {
                userByReference: true,
                userForReference: true
            }
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.NotificationUpdateInput }): Promise<Notification | null> {
        return this.prisma.notification.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<Notification | null> {
        return this.prisma.notification.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<Notification | null> {
        return this.prisma.notification.update({ where:{id}, data:{ isDelete:false } });
    }
}