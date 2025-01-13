import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class ProjectModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.projectsCreateInput}) {
        const result = this.prisma.projects.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.projectsWhereInput, select?:Prisma.projectsSelect }) {
        const result = this.prisma.projects.findMany({ 
            skip, 
            take, 
            where: filter, 
            select: {
                id: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,

                authos:     {
                    include: {
                        createByRef: {
                            include: {
                                parroquiaReference: {
                                    include: {
                                        municipioReference: {
                                            include: {
                                                stateReference: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    }
                },
                date:       true,                
                downloader: true,
                public: true,
                keywords: true,
                resumen: true,
                status: true,
                title: true,

                documentRef: true,
                programRef: {
                    select: {
                        name: true,
                        categoryRef: true
                    }
                },
                lineRef:    true,


                _count: {
                    select: {
                        authos: true,
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.projectsWhereInput, select?:Prisma.projectsSelect }) {
        const result = this.prisma.projects.findFirst({ 
            where: filter, 
            select: {
                id: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,

                authos:     {
                    include: {
                        createByRef: true
                    }
                },
                date:       true,                
                downloader: true,
                public: true,
                keywords: true,
                resumen: true,
                status: true,
                title: true,

                documentRef: true,
                programRef: {
                    select: {
                        name: true,
                        categoryRef: true
                    }
                },
                lineRef:    true,


                _count: {
                    select: {
                        authos: true,
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.projectsWhereInput }) {
        const result = this.prisma.projects.count({ 
            where: filter,
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.projectsWhereUniqueInput, data: Prisma.projectsUpdateInput}) {
        const result = this.prisma.projects.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.projects.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.projects.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }
}
