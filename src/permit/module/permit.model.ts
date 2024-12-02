import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class PermitModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.userGroupCreateInput}) {
        const result = this.prisma.userGroup.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.userGroupWhereInput, select?:Prisma.userGroupSelect }) {
        const result = this.prisma.userGroup.findMany({ 
            skip, 
            take, 
            where: filter, 
            select: {
                id: true,
                name: true,
                group: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.userGroupWhereInput, select?:Prisma.userGroupSelect }) {
        const result = this.prisma.userGroup.findFirst({ 
            where: filter, 
            select: select ? select : {
                id: true,
                name: true,
                group: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.userGroupWhereInput }) {
        const result = this.prisma.userGroup.count({ 
            where: filter,
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.userGroupWhereUniqueInput, data: Prisma.userGroupUpdateInput}) {
        const result = this.prisma.userGroup.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.userGroup.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.userGroup.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }
}
