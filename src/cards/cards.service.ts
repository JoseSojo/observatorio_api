import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import CategoryModel from 'src/config/model/category.model';
import ProgramModel from 'src/config/model/program.model';
import AppPermit from 'src/permit/module/app.permit';
import { PrismaService } from 'src/prisma/prisma.service';
import ProjectModel from 'src/project/model/project.model';
import UserModel from 'src/user/model/user.model';
import { Card } from 'src/validation/types/DashboardInterface';

@Injectable()
export class CardsService {

    private permitFound: string;

    constructor(
        private prisma: PrismaService,
        private user: UserModel,
        private appPermit: AppPermit,

        private projects: ProjectModel,
        private programs: ProgramModel,
        private categorys: CategoryModel,
    ) {
        this.permitFound = this.appPermit.APP_PERMIT_ANALITIC_SECTION;
    }

    // Crea 1 card por cada categoría
    public async publicCards(): Promise<Card[]> {
        const cards: Card[] = [];

        const test = await this.prisma.configCategory.findMany({
            include: { configProgram: { include: { _count: true }}},
            where: { configProgram:{every:{projects:{every:{deleteAt:``}}}} },
            orderBy: { name: 'asc' },
            skip: 0,
            take: 4
        });

        console.log(test);

        test.forEach(item => {
            let sum = 0; 
            item.configProgram.forEach(pr => sum += pr._count.projects) 
            cards.push({ ico: ``, label: `${item.ident} - ${item.name}`, value: sum });
        })


        return cards;
    }

    public async test() { }

}
