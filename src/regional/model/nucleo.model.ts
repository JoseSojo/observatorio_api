import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class NucleoModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configNucleoCreateInput}) {
        const result = this.prisma.configNucleo.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configNucleoWhereInput, select?:Prisma.configNucleoSelect }) {
        const result = this.prisma.configNucleo.findMany({ 
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
                parroquiaReference: true,
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configNucleoWhereInput, select?:Prisma.configNucleoSelect }) {
        const result = this.prisma.configNucleo.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                parroquiaReference: true,
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configNucleoWhereInput }) {
        const result = this.prisma.configNucleo.count({ 
            where: {...filter, deleteAt:null},
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configNucleoWhereUniqueInput, data: Prisma.configNucleoUpdateInput}) {
        const result = await this.prisma.configNucleo.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configNucleo.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configNucleo.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
