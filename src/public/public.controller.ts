import { Controller, Get, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import CategoryModel from 'src/config/model/category.model';
import { ConfigCategoryService } from 'src/config/service/category.service';
import { ConfigProgramService } from 'src/config/service/program.service';
import ProjectService from 'src/project/project.service';

@Controller('public')
export class PublicController {

    constructor(
        private categoryService: ConfigCategoryService,
        private programService: ConfigProgramService,
        private projectService: ProjectService,
    ) {}

    @Get(`category`)
    private async GetCategory(@Query() query: {skip:string,take:string,param?:string}) {
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.configCategoryWhereInput = {name:{contains:query.param}}

        const responseServicePromise = this.categoryService.paginate({ filter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;


    }

    @Get(`program`)
    private async GetProgram(@Query() query: {skip:string,take:string,param?:string,category?:string}) {
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;


        const filter: Prisma.configProgramWhereInput[] = [];

        if(query.param) filter.push({ name:{contains:query.param} });
        if(query.category) filter.push({ categoryId:query.category });

        const customFilter: Prisma.configProgramWhereInput = {AND:filter};

        const responseServicePromise = this.programService.paginate({ filter:customFilter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;


    }

    @Get(`project`)
    private async GetProject(@Query() query: {skip:string,take:string,param?:string,category?:string,program?:string}) {
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.projectsWhereInput[] = [];

        filter.push({ public: true })

        if(query.param) { filter.push({ title:{contains:query.param} }) };
        if(query.program) { filter.push({ programId:query.program }) };
        if(query.category) { filter.push({ programRef:{ categoryId:query.category } }) };


        const customFilter: Prisma.projectsWhereInput = { AND:filter }
        const responseServicePromise = this.projectService.paginate({ filter:customFilter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;


    }

}
