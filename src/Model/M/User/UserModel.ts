import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { GlobalService } from 'src/Service/GlobalService';
import { PrismaService } from 'src/Service/PrismaService';

@Injectable()
export class UserModel {

    constructor(
        private prisma: PrismaService,
        private global: GlobalService
    ) {}

    public async count({filter}: { filter:Prisma.UserWhereInput[] }): Promise<number> {
        return this.prisma.user.count({ where:{AND:[...filter, {isDelete:false}]} });
    }

    public async create({data}: {data: Prisma.UserCreateInput}) {
        return this.prisma.user.create({ 
            data: {
                ...data,
                password: await this.global.Hash({ password:data.password })
            },
            include:{
                cityReference:{
                    select:{
                        stateReference:{
                            select: {
                                countryReference: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    public async findBy({filter}:{filter: Prisma.UserWhereInput[]}): Promise<User | null> {
        return this.prisma.user.findFirst({ 
            where: { AND:[...filter, {isDelete:false}] },
            include: {
                rolReference: true,
                cityReference: true,
                _count: true,
                
            }
        })
    }

    public async findAll(
        {filter, skip, take, order}:
        {skip:number, take:number, filter?: Prisma.UserWhereInput[], order?: Prisma.UserOrderByWithAggregationInput}
    ): Promise<User[] | null> {
        return this.prisma.user.findMany({ 
            where:{ AND:[...filter, { isDelete:false }], },
            skip,
            take,
            orderBy: order ? order : { createAt:'desc' },
        });
    }

    public async update({ id, data }: { id:string, data:Prisma.UserUpdateInput }): Promise<User | null> {
        return this.prisma.user.update({ where:{id}, data });
    }

    public async softDelete({ id }: { id:string }): Promise<User | null> {
        return this.prisma.user.update({ where:{id}, data:{ isDelete:true } });
    }

    public async softRecover({ id }: { id:string }): Promise<User | null> {
        return this.prisma.user.update({ where:{id}, data:{ isDelete:false } });
    }
}