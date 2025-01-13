import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class EducationModel {

    constructor(
        private prisma: PrismaService
    ) { }

    public async create({ data }: { data: Prisma.educationProfileCreateInput }) {
        const result = this.prisma.educationProfile.create({ data });
        // estadistica
        return result;
    }

    public async findAll({ skip, take, filter, select }: { skip?: number, take?: number, filter?: Prisma.educationProfileWhereInput, select?: Prisma.cursosProfileSelect }) {
        const result = this.prisma.educationProfile.findMany({
            skip,
            take,
            where: { AND: [{ ...filter }, { deleteAt: null }] },
            select: {
                id: true,
                area: true,
                countryId: true,
                institucion: true,
                nivel: true,
                profesion: true,
                subarea: true,
                yearEnd: true,
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

    public async createCurso({ data }: { data: Prisma.cursosProfileCreateInput }) {
        const result = this.prisma.cursosProfile.create({ data });
        // estadistica
        return result;
    }

    public async findAllCurso({ skip, take, filter, select }: { skip?: number, take?: number, filter?: Prisma.cursosProfileWhereInput, select?: Prisma.cursosProfileSelect }) {
        const result = this.prisma.cursosProfile.findMany({
            skip,
            take,
            where: { AND: [{ ...filter }, { deleteAt: null }] },
            select: {
                id: true,
                area: true,
                country: true,
                institucion: true,
                description: true,
                horas: true,
                subarea: true,
                tipo: true,
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

    public async countCursos({ filter }: { filter?: Prisma.cursosProfileWhereInput }) {
        const result = this.prisma.cursosProfile.count({
            where: { AND: [{ ...filter }, { deleteAt: null }] },
        });

        return result;
    }

    public async find({ filter, select }: { filter?: Prisma.educationProfileWhereInput, select?: Prisma.educationProfileSelect }) {
        const result = this.prisma.educationProfile.findFirst({
            where: filter,
            select: select ? select : {
                id: true,
                area: true,
                countryId: true,
                institucion: true,
                nivel: true,
                profesion: true,
                subarea: true,
                yearEnd: true,
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

    public async count({ filter }: { filter?: Prisma.educationProfileWhereInput }) {
        const result = this.prisma.educationProfile.count({
            where: { AND: [{ ...filter }, { deleteAt: null }] },
        });

        return result;
    }

    public async update({ filter, data }: { filter?: Prisma.educationProfileWhereUniqueInput, data: Prisma.educationProfileUpdateInput }) {
        const result = this.prisma.educationProfile.update({
            data,
            where: filter
        });
        // estadistica
        return result;
    }

    public async softDelete({ id }: { id: string }) {
        const date = new Date();
        const result = this.prisma.educationProfile.update({
            data: { deleteAt: date.getDate().toString() },
            where: { id }
        });
        // estadistica
        return result;
    }

    public async recovery({ id }: { id: string }) {
        const result = this.prisma.educationProfile.update({
            data: { deleteAt: null },
            where: { id }
        });
        // estadistica
        return result;
    }
}
