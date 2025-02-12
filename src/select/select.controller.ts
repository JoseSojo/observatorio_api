import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigCategoryService } from 'src/config/service/category.service';
import { ConfigLineService } from 'src/config/service/line.service';
import { ConfigProgramService } from 'src/config/service/program.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { LanguajeService } from 'src/languaje/languaje.service';
import AppPermit from 'src/permit/module/app.permit';
import { PermitService } from 'src/permit/permit.service';
import ProjectService from 'src/project/project.service';
import { ConfigEstadoService } from 'src/regional/service/estados.service';
import { ConfigMunicipioService } from 'src/regional/service/municipio.service';
import { ConfigNucleoService } from 'src/regional/service/nucleo.service';
import { ConfigParroquiaService } from 'src/regional/service/parroquia.service';
import { UserService } from 'src/user/user.service';

@Controller('select')
export class SelectController {

    private lang: LanguajeInterface;

    constructor(
        private permit: AppPermit,
        private languje: LanguajeService,

        // modules
        private userService: UserService,
        private categoryService: ConfigCategoryService,
        private programService: ConfigProgramService,
        private lineService: ConfigLineService,
        private permitService: PermitService,
        private projectService: ProjectService,

        private stateService: ConfigEstadoService,
        private municipioService: ConfigMunicipioService,
        private parroquiaService: ConfigParroquiaService,
        private nucleoService: ConfigNucleoService,

    ) {
        this.lang = this.languje.GetTranslate();
    }

    @Get(`/:id`)
    @UseGuards(AuthGuard)
    private async select(@Req() req: any, @Param() param: { id: string }, @Query() query: { param?: string, category?: string }) {


        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        let list: { id: string, label: string }[] = [];

        console.log(param.id);

        if (param.id === `category`) {
            const result = await this.categoryService.paginate({ skip: 0, take: 20, filter: { OR: [{ ident: { contains: query.param ? query.param : `` } }, { name: { contains: query.param ? query.param : `` } }] } });
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: item.name });
            });
            list = data;
        } else if (param.id === `program`) {
            const filter: Prisma.configProgramWhereInput = { name: { contains: query.param ? query.param : `` } }
            if (query.category) {
                filter.categoryId = query.category
            }
            const result = await this.programService.paginate({ skip: 0, take: 20, filter });
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: item.name });
            });
            list = data;
        } else if (param.id === `line`) {
            const result = await this.lineService.paginate({ skip: 0, take: 20, filter: { name: { contains: query.param ? query.param : `` } } });
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: item.name });
            });
            list = data;
        } else if (param.id == `estudiante`) {
            const studentStruc = await this.permitService.find({ filter: { name: this.permit.ESTUDIANTE } });
            const student = studentStruc.body;

            const result = await this.userService.paginate({ skip: 0, take: 20, filter: { AND: [{ rolId: student.id }, { name: { contains: query.param ? query.param : `` } }, { lastname: { contains: query.param ? query.param : `` } }, { email: { contains: query.param ? query.param : `` } }, { username: { contains: query.param ? query.param : `` } }] } });
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: `${item.ci ? `${item.ci} -` : ``} ${item.name} ${item.lastname}` });
            });
            list = data;
        } else if (param.id == `rolId`) {
            let customFilter: Prisma.userGroupWhereInput = {name: this.permit.ESTUDIANTE};

            if(user.rolReference.name === this.permit.SUPER_ADMIN) {
                customFilter = { OR:[{name: this.permit.ESTUDIANTE},{name: this.permit.COODINADOR},{name:this.permit.ANALISTA}] }
            } else if(user.rolReference.name === this.permit.COODINADOR) {
                customFilter = {name: this.permit.ESTUDIANTE};
            }

            const permitStruc = await this.permitService.paginate({ filter:customFilter,skip:0,take:5 });
            const permitss = permitStruc.body.list;

            const data: { id: string, label: string }[] = [];
            permitss.map((item: any) => {
                data.push({ id: item.id, label: item.name });
            });
            list = data;
        } else if (param.id == `estadoId` || param.id == `estado`) {
            // const studentStruc = await this.permitService.find({ filter: { name: this.permit.ESTUDIANTE } });
            // const student = studentStruc.body;

            const result = await this.stateService.paginate({ skip: 0, take: 20, filter: { name:{ contains:query.param ? query.param : `` } }});
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: `${item.name}` });
            });
            list = data;
        } else if (param.id == `municipio` || param.id == `municipioId`) {
            // const studentStruc = await this.permitService.find({ filter: { name: this.permit.ESTUDIANTE } });
            // const student = studentStruc.body;

            const result = await this.municipioService.paginate({ skip: 0, take: 20, filter: { name:{ contains:query.param ? query.param : `` } }});
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: `${item.name} - ${item.stateReference.name}` });
            });
            list = data;
        } else if (param.id == `parroquia` || param.id == `parroquiaId`) {
            // const studentStruc = await this.permitService.find({ filter: { name: this.permit.ESTUDIANTE } });
            // const student = studentStruc.body;

            const result = await this.parroquiaService.paginate({ skip: 0, take: 20, filter: { name:{ contains:query.param ? query.param : `` } }});
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: `${item.name}` });
            });
            list = data;
        } else if (param.id == `lineParent` || param.id == `lineParentId`) {
            // const studentStruc = await this.permitService.find({ filter: { name: this.permit.ESTUDIANTE } });
            // const student = studentStruc.body;
            

            const result = await this.lineService.paginate({ skip: 0, take: 20, filter: { name:{ contains:query.param ? query.param : `` } }});
            const data: { id: string, label: string }[] = [];
            result.body.list.map((item: any) => {
                data.push({ id: item.id, label: `${item.name}` });
            });
            list = data;
        }

        return {
            list
        }

    }

}
