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
            where: { configProgram:{every:{projects:{every:{AND:[{deleteAt:``}]}}}} },
            orderBy: { name: 'asc' },
            skip: 0,
            take: 4
        });
        let all = 0;

        test.forEach(item => {
            let sum = 0; 
            item.configProgram.forEach(pr => sum += pr._count.projects) 
            cards.push({ ico: ``, label: `${item.ident} - ${item.name}`, value: sum });
            all += sum;
        })

        cards.push({
            ico: `all`,
            label: `Todos`,
            value: all
        })


        return cards;
    }

    public async Genero(): Promise<{label:string[], value:number[]}> {
        const label: string[] = [];
        const value: number[] = [];

        const femalePromise = this.prisma.user.count({ where:{ sexo:`F` } });
        const malePromise = this.prisma.user.count({ where:{ sexo:`M` } });

        const female = await femalePromise;
        const male = await malePromise;

        label.push(`Hombres`);
        value.push(male);

        label.push(`Mujeres`);
        value.push(female)

        return {label,value};
    }


    public async DistribucionEtario(): Promise<{label:string[], value:number[]}> {
        const label = [`0 - 14`,`15 - 24`,`25 - 34`,`35 - 44`,`45 - 54`,`55 - 64`,`65 - 74`, `75+`];
        const value: number[] = [];

        const de014Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:0} },{ age:{lte:14} }]} });
        const de1524Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:15} },{ age:{lte:24} }]} });
        const de2534Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:25} },{ age:{lte:34} }]} });
        const de3544Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:35} },{ age:{lte:44} }]} });
        const de4555Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:45} },{ age:{lte:55} }]} });
        const de5564Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:55} },{ age:{lte:64} }]} });
        const de6574Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:65} },{ age:{lte:74} }]} });
        const de75Promise = this.prisma.user.count({ where:{AND:[{ age:{gte:75} }]} });

    public async DistribucionEtario(findBy: string): Promise<{label:string[], value:number[]}> {
        const label = [`0 - 14`,`15 - 24`,`25 - 34`,`35 - 44`,`45 - 54`,`55 - 64`,`65 - 74`, `75+`];
        const value: number[] = [];

        const de014Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:0} },{ age:{lte:14} }]} });
        const de1524Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:15} },{ age:{lte:24} }]} });
        const de2534Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:25} },{ age:{lte:34} }]} });
        const de3544Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:35} },{ age:{lte:44} }]} });
        const de4555Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:45} },{ age:{lte:55} }]} });
        const de5564Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:55} },{ age:{lte:64} }]} });
        const de6574Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:65} },{ age:{lte:74} }]} });
        const de75Promise = this.prisma.user.count({ where:{AND:[{sexo:findBy},{ age:{gte:75} }]} });


        const de014 = await de014Promise;
        const de1524 = await de1524Promise;
        const de2534 = await de2534Promise;
        const de3544 = await de3544Promise;
        const de4555 = await de4555Promise;
        const de5564 = await de5564Promise;
        const de6574 = await de6574Promise;
        const de75 = await de75Promise;
        
        label.push(`0 - 14`);
        value.push(de014);
        label.push(`15 - 24`);
        value.push(de1524);
        label.push(`25 - 34`);
        value.push(de2534);
        label.push(`35 - 44`);
        value.push(de3544);
        label.push(`45 - 54`);
        value.push(de4555);
        label.push(`55 - 64`);
        value.push(de5564);
        label.push(`65 - 74`);
        value.push(de6574);
        label.push(`75+`);
        value.push(de75);

        return {label,value};
    }

    public async DondeLaboral(): Promise<{label:string[], value:number[]}> {
        const label = [];
        const value: number[] = [];

        const labels = await this.prisma.workProfile.groupBy({
            by: `institucion`,
            orderBy: {
                institucion: `asc`
            }
        });

        labels.forEach(async(item) => {
            const foundPromise = this.prisma.user.count({
                where: {
                    works: {
                        some: {
                            institucion: item.institucion
                        }
                    }
                }
            });
            label.push(item.institucion);
            value.push(await foundPromise);
        })

        return {label,value};
    }

    public async DistribucionEstudios(): Promise<{label:string[], value:number[]}> {
        const label = [];
        const value: number[] = [];

        const labels = await this.prisma.educationProfile.groupBy({
            by: `nivel`,
            orderBy: {
                nivel: `asc`
            }
        });

        labels.forEach(async(item) => {
            const foundPromise = this.prisma.user.count({
                where: {
                    education: {
                        some: {
                            nivel: item.nivel
                        }
                    }
                }
            });
            label.push(item.nivel);
            value.push(await foundPromise);
        })

        return {label,value};
    }

    public async DistribucionAreaConocimiento(): Promise<{label:string[], value:number[]}> {
        const label = [];
        const value: number[] = [];

        const labels = await this.prisma.educationProfile.groupBy({
            by: `area`,
            orderBy: {
                area: `asc`
            }
        });

        labels.forEach(async(item) => {
            const foundPromise = this.prisma.user.count({
                where: {
                    education: {
                        some: {
                            area: item.area
                        }
                    }
                }
            });
            label.push(item.area);
            value.push(await foundPromise);
        })

        return {label,value};
    }


    public async test() { }

    public async StatesBY () {
        const label = [];
        const value: number[] = [];

        // this.DistribucionAreaConocimiento();
        // this.DistribucionEstudios();
        // this.DistribucionEtario();

        const resultPromise = this.prisma.configState.groupBy({
            by: `name`,
            orderBy: {
                name: `asc`
            }
        });

        let result = await resultPromise;

        result.forEach((item) => label.push(item.name));

        const todosPromise = this.FindToStates(label);
        const hombrePromise = this.FindToStates(label, `M`);
        const mujerPromise = this.FindToStates(label, `F`);

        const todos = await todosPromise;
        const hombre = await hombrePromise;
        const mujer = await mujerPromise;

        console.log(todos);
        console.log(hombre);
        console.log(mujer);

        const customList = [
            {
                label: `Hombre`,
                backgroundColor:`#0E46A3`,
                data: hombre
            },
            {
                label: `Mujeres`,
                backgroundColor:`#0E46A3`,
                data: mujer
            },
            {
                label: `Todos`,
                backgroundColor:`#0E46A3`,
                data: todos
            }
        ]

        /**
        {
            data:[1,4,3,2],
            backgroundColor:`#0E46A3`,
            label: `Todos`,
        }
         */

        return {
            data: customList,
            label,
        };
    }

    private async FindToStates (label: string[], sex?: string) {
        const value = [];
        label.forEach(async (item) => value.push(await this.findByEach(item, sex)));
        return value;
    }

    private async findByEach(label: string, sex?: string) {
        const result = this.prisma.user.count({
            where: {
                AND: [
                    {
                        parroquiaReference: {
                            municipioReference: {
                                stateReference: {
                                    name: label
                                }
                            }
                        }
                    }, {
                        sexo: sex ? sex : { contains:`` },
                    }
                ]
            }
        });

        console.log({label,sexo: sex ? sex : { contains:`` }, total:await result})

        return await result;
    }

}
