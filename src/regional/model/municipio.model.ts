import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class MunicipioModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configMunicipioCreateInput}) {
        const result = this.prisma.configMunicipio.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configMunicipioWhereInput, select?:Prisma.configMunicipioSelect }) {
        const result = this.prisma.configMunicipio.findMany({ 
            skip, 
            take, 
<<<<<<< HEAD
=======
            orderBy: {
                stateReference: {
                    name: "asc"
                }
            },
>>>>>>> b0a1d26 (add remote brnach)
            where: { ...filter, deleteAt: null }, 
            select: {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                stateReference: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        parroquias: true
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configMunicipioWhereInput, select?:Prisma.configMunicipioSelect }) {
        const result = this.prisma.configMunicipio.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                stateReference: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        parroquias: true
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configMunicipioWhereInput }) {
        const result = this.prisma.configMunicipio.count({ 
            where: {...filter, deleteAt:null},
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configMunicipioWhereUniqueInput, data: Prisma.configMunicipioUpdateInput}) {
        const result = await this.prisma.configMunicipio.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configMunicipio.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configMunicipio.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
