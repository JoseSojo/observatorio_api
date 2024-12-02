import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { find } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export default class ConfigDocumentModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async GetSizeByte({}: {}) {
        const result = this.prisma.configDocument.aggregate({
            _sum:{size:true}
        })
        return result;
    }

    public async Count({}: {}) {
        const result = this.prisma.configDocument.count()
        return result;
    }

    public async create ({data}: {data:Prisma.configDocumentCreateInput}) {
        const result = this.prisma.configDocument.create({ data });
        // estadistica
        return result;
    }

    // public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.configCategoryWhereInput, select?:Prisma.configCategorySelect }) {
    //     const result = this.prisma.configCategory.findMany({ 
    //         skip, 
    //         take, 
    //         where: { ...filter, deleteAt: null }, 
    //         select: {
    //             id: true,
    //             name: true,
    //             createAt: true,
    //             updateAt: true,
    //             deleteAt: true,
    //             createByRef: true,
    //             createById: true,
    //             ident: true,
    //             _count: {
    //                 select: {
    //                     configProgram: true
    //                 }
    //             }
    //         }
    //     });

    //     return result;
    // }

    // public async find({ filter, select }: { filter?:Prisma.configCategoryWhereInput, select?:Prisma.configCategorySelect }) {
    //     const result = this.prisma.configCategory.findFirst({ 
    //         where: { ...filter, deleteAt: null }, 
    //         select: select ? select : {
    //             id: true,
    //             name: true,
    //             createAt: true,
    //             updateAt: true,
    //             deleteAt: true,
    //             createByRef: true,
    //             createById: true,
    //             ident: true,
    //             _count: {
    //                 select: {
    //                     configProgram: true
    //                 }
    //             }
    //         }
    //     });

    //     return result;
    // }

    // public async count({ filter }: { filter?:Prisma.configCategoryWhereInput }) {
    //     const result = this.prisma.configCategory.count({ 
    //         where: filter,
    //     });

    //     return result;
    // }

    // public async update({ filter, data }: { filter?:Prisma.configCategoryWhereUniqueInput, data: Prisma.configCategoryUpdateInput}) {
    //     const result = this.prisma.configCategory.update({
    //         data,
    //         where: filter
    //     });
    //     // estadistica
    //     return result;
    // }

    // public async softDelete({ id }: { id:string }) {
    //     const date = new Date();
    //     const result = this.prisma.configCategory.update({
    //         data: { deleteAt: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}` },
    //         where: { id }
    //     });
    //     // estadistica
    //     return result;
    // }

    // public async recovery({ id }: { id:string }) {
    //     const result = this.prisma.configCategory.update({
    //         data: { deleteAt: null },
    //         where: { id }
    //     });
    //     // estadistica
    //     return result;
    // }
} 
