import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class ProgramModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configProgramCreateInput}) {
        const result = this.prisma.configProgram.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configProgramWhereInput, select?:Prisma.configProgramSelect }) {
        const result = this.prisma.configProgram.findMany({ 
            skip, 
            take, 
            where: { ...filter, deleteAt: null }, 
            select: {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                categoryRef: true,
                _count: {
                    select: {
                        projects: true
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configProgramWhereInput, select?:Prisma.configProgramSelect }) {
        const result = this.prisma.configProgram.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                categoryRef: true,
                _count: {
                    select: {
                        projects: true
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configProgramWhereInput }) {
        const result = this.prisma.configProgram.count({ 
            where: filter,
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configProgramWhereUniqueInput, data: Prisma.configProgramUpdateInput}) {
        const result = this.prisma.configProgram.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configProgram.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configProgram.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
