import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import CategoryModel from 'src/config/model/category.model';
import LineModel from 'src/config/model/line.model';
import ProgramModel from 'src/config/model/program.model';
import { AuthGuard } from 'src/guards/AuthGuard';
import ProjectModel from 'src/project/model/project.model';


export interface ReportInterface {

    title: string;
    page: any[];
    history?: any[];
    header: string[];
    label: string[];
}



@Controller('report')
export class ReportController {

    constructor(
        private model: ProjectModel,
        private category: CategoryModel,
        private program: ProgramModel,
        private line: LineModel,
    ) { }

    @Get(``)
    @UseGuards(AuthGuard)
    private async reportProject(@Query() query: { category?: string, program?: string, line?: string, dateStart?: string, dateEnd?: string }) {

        const report: ReportInterface = {
            title: `Reporte`,
            page: [],
            header: [`Título`, `Programa`, `Categoría`, `Línea de investigación`, `Autores`, `Fecha`],
            label: [`title`, `programRef.name`, `programRef.categoryRef.name`, `lineRef.name`, `_count.authos`, `date`]
        }

        const filter: Prisma.projectsWhereInput[] = [];

        if (query.line) {
            filter.push({ lineId: query.line });
        }

        if (query.program) {
            filter.push({ programId: query.program });
        }

        if (query.category && !query.program) {
            // const programsFound = this.program.find({ filter:{ AND:[{categoryId:query.category},{deleteAt:null}] }, select:{id:true} });

            filter.push({ programRef: { categoryId: query.category } });

        }

        const customFilter: Prisma.projectsWhereInput = filter.length > 0 ? { AND: [...filter, { deleteAt: null }] } : { deleteAt: null };

        // lógica
        const count = await this.model.count({ filter: customFilter });
        let now = 0;
        let skip = 0;
        let take = 15;

        let select: Prisma.projectsSelect = {
            title: true,
            authos: true,
            lineRef: {
                select: {
                    name: true
                }
            },
            programRef: {
                select: {
                    name: true,
                    categoryRef: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        };

        do {
            const find = await this.model.findAll({ skip, take, filter: customFilter, select });

            report.page.push({ list: find });

            skip = skip + take;
            now = now + take
        } while (now < count);

        return { ...report, count };
    }

}
