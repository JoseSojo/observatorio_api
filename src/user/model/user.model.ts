import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class UserModel {

    constructor (
        private prisma: PrismaService
    ) {}

    public async create ({data}: {data:Prisma.userCreateInput}) {
        const result = this.prisma.user.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?:number,take?:number,filter?:Prisma.userWhereInput, select?:Prisma.userSelect }) {
        const result = this.prisma.user.findMany({ 
            skip, 
            take, 
            where: {AND:[{...filter},{deleteAt:null}]}, 
            select: {
                id: true,
                name: true,
                email: true,
                lastname: true,
                rolReference: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                ci: true,
                userGroup: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?:Prisma.userWhereInput, select?:Prisma.userSelect }) {
        const result = this.prisma.user.findFirst({ 
            where: filter, 
            select: select ? select : {
                id: true,
                name: true,
                email: true,
                lastname: true,
                password: true,
                rolReference: true,
                parentReference: true,
                token: true,
                age: true,
                birtdate: true,
                ci: true,
                email2: true,
                estadoCivil: true,
                nacionality: true,
                phone: true,
                phone2: true,
                sexo: true,
                secondName: true,
                secondLastname: true,
                parroquiaReference: {
                    select: {
                        name: true,
                        id: true,
                        municipioReference: {
                            select: {
                                name: true,
                                id: true,
                                stateReference: {
                                    select: {
                                        name: true,
                                        id: true
                                    }
                                }
                            }
                        }
                    }
                },
                username: true,
                createAt: true,
                updateAt: true,
                deleteAt: true,
                userGroup: {
                    select: {
                        name: true,
                        group: true,
                    }
                },
                _count: {
                    select: {
                        authors: { where:{ deleteAt:null } }
                    }
                }
            }
        });

        return result;
    }

    public async count({ filter }: { filter?:Prisma.userWhereInput }) {
        const result = this.prisma.user.count({ 
            where: {AND:[{...filter},{deleteAt:null}]},
        });

        return result;
    }

    public async update({ filter, data }: { filter?:Prisma.userWhereUniqueInput, data: Prisma.userUpdateInput}) {
        const result = this.prisma.user.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id:string }) {
        const date = new Date();
        const result = this.prisma.user.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id:string }) {
        const result = this.prisma.user.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }
}
