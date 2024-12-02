import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class ParroquiaModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configParroquiaCreateInput}) {
        const result = this.prisma.configParroquia.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configParroquiaWhereInput, select?:Prisma.configParroquiaSelect }) {
        const result = this.prisma.configParroquia.findMany({ 
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
                municipioReference: true,
                _count: {
                    select: {
                        nucleos: true,
                        user: true,
                
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configParroquiaWhereInput, select?:Prisma.configParroquiaSelect }) {
        const result = this.prisma.configParroquia.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                municipioReference: true,
                _count: {
                    select: {
                        nucleos: true,
                        user: true,
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configParroquiaWhereInput }) {
        const result = this.prisma.configParroquia.count({ 
            where: filter,
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configParroquiaWhereUniqueInput, data: Prisma.configParroquiaUpdateInput}) {
        const result = this.prisma.configParroquia.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configParroquia.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configParroquia.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
