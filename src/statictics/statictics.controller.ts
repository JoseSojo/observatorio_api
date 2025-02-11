import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { StaticticsService } from "./statictics.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthGuard } from "src/guards/AuthGuard";
import AppPermit from "src/permit/module/app.permit";

@Controller(`statictics`)
export default class StaticticsController {

    constructor(
        private statictics: StaticticsService,
        private prisma: PrismaService,
        private permit: AppPermit,
    ) {}

    @Get(`found`)
    @UseGuards(AuthGuard) 
    private staticticsFound(@Req() req: any, @Query() query:{key:`all`|`user`|`project`|`public`|`dashboard`|`analysis`}) {
        const staticticsFound: {path:string,label:string}[] = [];
        const user = req.user as any;
        const name = user.rolReference.name as string;
        const permits = user.rolReference.group as string[];

        if(query.key === `all`) {
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_PROJECT)) staticticsFound.push({path:`/statictics/projects/all`, label:`Estadisticas de usuarios`});
        } else if(query.key === `user`) {
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=month`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=year`, label:`Estadisticas de usuarios`});
            // if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=century`, label:`Estadisticas de usuarios`});
        } else if(query.key === `project`) {
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/projects/all/?key=month`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/projects/all/?key=year`, label:`Estadisticas de usuarios`});
            // if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/projects/all/?key=century`, label:`Estadisticas de usuarios`});
        } else if(query.key === `dashboard`) {
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=month`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_PROJECT)) staticticsFound.push({path:`/statictics/projects/all/?key=month`, label:`Estadisticas de usuarios`});
        } else if(query.key === `analysis`) {
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=month`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/projects/all/?key=month`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=year`, label:`Estadisticas de usuarios`});
            if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/projects/all/?key=year`, label:`Estadisticas de usuarios`});
            // if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/users/all/?key=century`, label:`Estadisticas de usuarios`});
            // if(permits.includes(this.permit.STATICTICS_CREATE_USER)) staticticsFound.push({path:`/statictics/projects/all/?key=century`, label:`Estadisticas de usuarios`});
        }

        return staticticsFound;
    }

    @Get(`users/all`)
    private async staticticsUser(@Query() query: {key:`year`|`month`|`century`,day:string,month:string,year:string}) {
        const date = new Date();

        const day = query.day ? Number(query.day) : date.getDate();
        const month = query.month ? Number(query.month) : date.getMonth()+1;
        const year = query.year ? Number(query.year) : date.getFullYear();

        let header = [];
        let list = [];
        let title = `Gráfico no disponible`;
        let filter: any|null = null;
        let filterName: string[] | null = null;
        let labelFilter: string[] | null = null;

        const listResult = await this.statictics.getStaticsUser({ day,month,year });

        console.log(query);

        if (query.key === `month` || query.key === (`month`+`/`)) {
            title = `Usuarios creados por mes.`;
            header = this.statictics.getHeaderDay();
            list = listResult.month;
            filter = await this.statictics.fitlerMonthUser();
            filterName = [`month`,`year`];
            labelFilter = [`Mes`,`Año`];
        }
        else if(query.key === `year` || query.key === (`year`+`/`)) {
            header = this.statictics.getHeaderMonth();
            list = listResult.year;
            title = `Usuarios creados por año.`;
            filter = [await this.statictics.filterYearUser()];
            labelFilter = [`Año`];
            filterName = [`year`]
        }

        return {
            title,
            header,
            value: list,
            filter,
            labelFilter
        }
    }

    @Get(`projects/all`)
    private async staticticsProject(@Query() query: {key:`year`|`month`|`century`,day:string,month:string,year:string}) {
        const date = new Date();
        if(query.key === "century") return 

        const day = query.day ? Number(query.day) : date.getDate();
        const month = query.month ? Number(query.month) : date.getMonth()+1;
        const year = query.year ? Number(query.year) : date.getFullYear();

        console.log(year);

        let header = [];
        let list = [];
        let title = `Gráfico no disponible`;
        let filter: any[] | null = null;
        let filterName: string[] | null = null;
        let labelFilter: string[] | null = null;

        const listResult = await this.statictics.getStaticsProject({ day,month,year });

        if(!listResult) return {
            title:``,
            header:[],
            value: [],
        }

        if (query.key === `month` || query.key === (`month`+`/`)) {
            header = this.statictics.getHeaderDay();
            list = listResult.month;
            title = `Proyectos creados por mes.`;
            filter = [await this.statictics.fitlerMonthProject(),await this.statictics.filterYearProject()];
            labelFilter = [`Mes`,`Año`];
            filterName = [`month`,`year`];
        }
        else if(query.key === `year` || query.key === (`year`+`/`)) {
            header = this.statictics.getHeaderMonth();
            list = listResult.year;
            title = `Proyectos creados por año.`;
            filter = [await this.statictics.filterYearProject()];
            labelFilter = [`Año`];
            filterName = [`year`];
        }

        return {
            title,
            header,
            value: list,
            filter,
            filterName,
            labelFilter
        }
    }

    @Get(`projects/century`)
    private async staticticsProjectCentury() {
        const projectCentury = await this.prisma.staticticsProjectForCentury.findMany();
        const projectGroupCentury = await this.prisma.staticticsProjectForCentury.groupBy({ by:`year` });

        let header = [];
        let list = [];
        let title = `Proyectos por años.`;

        projectGroupCentury.forEach((item) => {
            header.push(item.year.toString());
        })

        projectCentury.forEach(item => {
            list.push(item.totalYear);
        })

        return {
            title,
            header,
            value: list,
        }
    }
}
