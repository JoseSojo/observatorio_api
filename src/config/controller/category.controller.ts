import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ConfigCategoryService } from "../service/category.service";
import { LanguajeService } from "src/languaje/languaje.service";
import { LanguajeInterface } from "src/languaje/guard/languaje.interface";
import { CategoryCreate } from "../guards/category.guard";
import { Prisma } from "@prisma/client";
import { AuthGuard } from "src/guards/AuthGuard";
import { ConfigModule } from "../config.module";
import CategoryModel from "../model/category.model";
import { HistoryCreate } from "src/history/guards/history.guard";
import { HistoryService } from "src/history/history.service";
import { Request } from "express";
import AppEvent from "src/AppEvent";

@Controller(`category`)
export default class CategoryController {

    private lang: LanguajeInterface;

    constructor(
        private languaje: LanguajeService,
        private service: ConfigCategoryService,
        private history: HistoryService,
        private model: CategoryModel,
        private appEvent: AppEvent
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    private async create(@Req() req: any, @Body() body: CategoryCreate) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones
        const testName = this.service.find({ filter:{name:body.name} });
        if(!body.name) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.name,error: true }
        if((await testName).body) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.NAME_IN_USE,error: true }


        // lógica
        const currentBody: CategoryCreate = {
            id: body.id,
            name: body.name,
            userId: user.id
        }

        const responseService = await this.service.create({ data:currentBody });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_CATEGORY_RECOVERY,
            objectId: body.id ? body.id : responseService.body.id,
            objectName: `cateogry`,
            objectReference: `category`,
            userId: req.user.id ? req.user.id : `no_user`
        });


        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    private async paginate(@Req() req: any, @Query() query: { skip:string, take:string, param?:string, }) {
        // variables

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.configCategoryWhereInput = {}
        const responseServicePromise = this.service.paginate({ filter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;
    }

    @Get(`:id/history`)
    @UseGuards(AuthGuard)
    private async paginatehistory(@Req() req: any, @Param() param:{id:string},  @Query() query: { skip:string, take:string, param?:string }) {
        // variables

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.historyWhereInput = {
            objectId: param.id
        }

        const responseServicePromise = this.history.paginate({ filter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;
    }

    @Get(`:id/unique`)
    @UseGuards(AuthGuard)
    private async unique(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        // lógica
        const id = param.id;

        const filter: Prisma.configCategoryWhereInput = { id };
        const responseService = this.service.find({ filter });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    private async update(@Req() req: any, @Param() param: { id: string }, @Body() body: CategoryCreate) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones
        const testName = this.service.find({ filter:{AND:[{name:body.name},{id:{not:param.id}}]} });
        if(!body.name) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.name,error: true }
        if((await testName).body) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.NAME_IN_USE,error: true }


        // lógica
        const id = param.id;
        const currentBody: Prisma.configCategoryUpdateInput = {
            name: body.name,
            ident: body.id
        }

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_CATEGORY_UPDATE,
            objectId: id,
            objectName: `cateogry`,
            objectReference: `category`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        const responseService = this.service.udpate({ id,data:currentBody });
        return responseService;
    }

    @Put(`:id/delete`)
    @UseGuards(AuthGuard)
    private async delete(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        // lógica
        const id = param.id;

        const responseService = this.service.delte({ id });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_CATEGORY_DELETE,
            objectId: id,
            objectName: `cateogry`,
            objectReference: `category`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }

    @Put(`:id/recovery`)
    @UseGuards(AuthGuard)
    private async recovery(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        //historial
        // lógica
        const id = param.id;

        const responseService = this.service.recovery({ id });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_CATEGORY_RECOVERY,
            objectId: id,
            objectName: `cateogry`,
            objectReference: `category`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }
    
    @Get(`/report/many`)
    @UseGuards(AuthGuard)
    private async reportMany(@Req() req: any) {
        // variables
        let filter: Prisma.configCategoryWhereInput = {deleteAt:null}

        const count = await this.model.count({filter});
        let now = 0;
        let skip = 0;
        let take = 15;

        const page: any[] = []; 

        // permisos

        // lógica

        let select: Prisma.configCategorySelect = {};
        let header: string[] = [];
        let label: string[]  = [];

        select = { name: true,_count:{select:{configProgram:true}},createByRef:{select:{name:true,lastname:true}},ident:true,createAt:true };
        header = [``,`Nombre`,`Programas`,`Creador`,``,`Creación`];
        label = [`ident`,`name`,`_count.configProgram`,`createByRef.name`,`createByRef.lastname`,`createAt`];

        do {
            const find = await this.model.findAll({ skip, take, filter, select });

            page.push({
                list: find
            });

            skip = skip + take;
            now = now + take
        } while (now < count);

        return {
            page: page,
            count: count,
            header,
            label,
        };
    }

    @Get(`/report/unique/:id`)
    @UseGuards(AuthGuard)
    private async reportUnique(@Req() req: any, @Param() param: {id:string}) {
        // variables

        const page: any[] = []; 
        const historyPromise = [];// this.getCustomHistory(param.id);

        const dataPromise = this.model.find({ filter:{ id:param.id } });

        const header = [`Identificación:`,`Nombre:`,`Programas:`,`Creado por:`,`Fecha creación:`,`Última actualización`];
        const label = [`ident`,`name`,`_count.configProgram`,`createByRef.email`,`createAt`,`updateAt`];

        const data = await dataPromise;
        const history = await historyPromise;
        
        return {
            data,
            history: history,
            header,
            label,  
        };
    }

    private async RegisterHistory (data: HistoryCreate) {
        await this.history.create({ data });
    }
}
