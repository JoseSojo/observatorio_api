import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class WorkModel {

    constructor(
        private prisma: PrismaService
    ) { }

    public async create({ data }: { data: Prisma.workProfileCreateInput }) {
        const result = this.prisma.workProfile.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?: number, take?: number, filter?: Prisma.workProfileWhereInput, select?: Prisma.cursosProfileSelect }) {
        const result = this.prisma.workProfile.findMany({
            skip,
            take,
            where: { AND: [{ ...filter }, { deleteAt: null }] },
            select: {
                id: true,
                dateEnd: true,
                dateStart: true,
                actual: true,
                cargo: true,
                institucion: true,
                ocupacion: true,
                tipoInstitucion: true,
                userRef: {
                    select: {
                        name: true,
                        lastname: true,
                        email: true,
                        id: true,
                    }
                }
            }
        });

        return result;
    }

    public async find({ filter, select }: { filter?: Prisma.workProfileWhereInput, select?: Prisma.workProfileSelect }) {
        const result = this.prisma.workProfile.findFirst({
            where: filter,
            select: select ? select : {
                id: true,
                dateEnd: true,
                dateStart: true,
                actual: true,
                cargo: true,
                institucion: true,
                ocupacion: true,
                tipoInstitucion: true,
                userRef: {
                    select: {
                        name: true,
                        lastname: true,
                        email: true,
                        id: true,
                    }
                },
                createAt: true,
                updateAt: true,
                deleteAt: true,

            }
        });

        return result;
    }

    public async count({ filter }: { filter?: Prisma.workProfileWhereInput }) {
        const result = this.prisma.workProfile.count({
            where: { AND: [{ ...filter }, { deleteAt: null }] },
        });

        return result;
    }

    public async update({ filter, data }: { filter?: Prisma.workProfileWhereUniqueInput, data: Prisma.workProfileUpdateInput }) {
        const result = this.prisma.workProfile.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id: string }) {
        const date = new Date();
        const result = this.prisma.workProfile.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id: string }) {
        const result = this.prisma.workProfile.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }
}
