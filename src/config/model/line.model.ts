import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class LineModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configInvestigationLineCreateInput}) {
        const result = this.prisma.configInvestigationLine.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configInvestigationLineWhereInput, select?:Prisma.configInvestigationLineSelect }) {
        const result = this.prisma.configInvestigationLine.findMany({ 
            skip, 
            take, 
<<<<<<< HEAD
=======
            orderBy: { name:"desc" },
>>>>>>> b0a1d26 (add remote brnach)
            where: { ...filter, deleteAt: null }, 
            select: {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                _count: {
                    select: {
                        projects: true
                    }
<<<<<<< HEAD
                }
=======
                },
                parentReference: true,
>>>>>>> b0a1d26 (add remote brnach)
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configInvestigationLineWhereInput, select?:Prisma.configInvestigationLineSelect }) {
        const result = this.prisma.configInvestigationLine.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
<<<<<<< HEAD
=======
                parentReference: true,
>>>>>>> b0a1d26 (add remote brnach)
                _count: {
                    select: {
                        projects: true
                    }
                }
<<<<<<< HEAD
=======
            },
            orderBy: {
                name: `asc`,
                parentReference: {
                    name: "asc",
                },
>>>>>>> b0a1d26 (add remote brnach)
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configInvestigationLineWhereInput }) {
        const result = this.prisma.configInvestigationLine.count({ 
            where: {...filter, deleteAt:null},
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configInvestigationLineWhereUniqueInput, data: Prisma.configInvestigationLineUpdateInput}) {
        const result = await this.prisma.configInvestigationLine.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configInvestigationLine.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configInvestigationLine.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
