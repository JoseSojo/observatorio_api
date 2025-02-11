import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CategoryCreate } from "../guards/category.guard";
import { Prisma } from "@prisma/client";

@Injectable()
export default class CategoryModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.configCategoryCreateInput}) {
        const result = this.prisma.configCategory.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configCategoryWhereInput, select?:Prisma.configCategorySelect }) {
        const result = this.prisma.configCategory.findMany({ 
            skip, 
            take, 
<<<<<<< HEAD
=======
            orderBy: { name:"desc" },
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
                ident: true,
                _count: {
                    select: {
                        configProgram: true
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.configCategoryWhereInput, select?:Prisma.configCategorySelect }) {
        const result = this.prisma.configCategory.findFirst({ 
            where: { ...filter, deleteAt: null }, 
            select: select ? select : {
                id: true,
                name: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                createByRef: true,
                createById: true,
                ident: true,
                _count: {
                    select: {
                        configProgram: true
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.configCategoryWhereInput }) {
        const result = this.prisma.configCategory.count({ 
            where: {...filter, deleteAt:null},
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.configCategoryWhereUniqueInput, data: Prisma.configCategoryUpdateInput}) {
        const result = this.prisma.configCategory.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.configCategory.update({
            data: { deleteAt: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}` },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.configCategory.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }

}
