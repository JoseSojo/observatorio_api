import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class EstadoModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configStateCreateInput}) {
        const result = this.prisma.configState.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configStateWhereInput, select?:Prisma.configStateSelect }) {
        const result = this.prisma.configState.findMany({ 
            skip, 
            take, 
<<<<<<< HEAD
=======
            orderBy: {name:"asc"},
>>>>>>> b0a1d26 (add remote brnach)
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        municipios: true
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configStateWhereInput, select?:Prisma.configStateSelect }) {
        const result = this.prisma.configState.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        municipios: true,
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configStateWhereInput }) {
        const result = this.prisma.configState.count({ 
            where: {...filter, deleteAt:null},
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configStateWhereUniqueInput, data: Prisma.configStateUpdateInput}) {
        const result = this.prisma.configState.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configState.update({
            data: { deleteAt: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}` },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configState.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
