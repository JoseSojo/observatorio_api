

import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { LanguajeService } from "src/languaje/languaje.service";
import { LanguajeInterface } from "src/languaje/guard/languaje.interface";
import { Prisma } from "@prisma/client";
import { AuthGuard } from "src/guards/AuthGuard";
import { HistoryCreate } from "src/history/guards/history.guard";
import { HistoryService } from "src/history/history.service";
import AppEvent from "src/AppEvent";
import { ConfigMunicipioService } from "../service/municipio.service";
import MunicipioModel from "../model/municipio.model";
import { MunicipioCreate } from "../guards/municipio.guard";

@Controller(`municipio`)
export default class MunicipioController {

    private lang: LanguajeInterface;

    constructor(
        private languaje: LanguajeService,
        private service: ConfigMunicipioService,
        private history: HistoryService,
        private appEvent: AppEvent,
        private model: MunicipioModel
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    private async create(@Req() req: any, @Body() body: MunicipioCreate) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones

        // lógica
        const currentBody: MunicipioCreate = {
            name: body.name,
            userId: user.id,
            estadoId: body.estadoId
        }

        const responseService = await this.service.create({ data:currentBody }) as any;
        
        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_CATEGORY_CREATE,
            objectId: responseService.body.id ? responseService.body.id : responseService.body.id,
            objectName: `cateogry`,
            objectReference: `category`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    private async paginate(@Req() req: any, @Query() query: { skip:string, take:string, param?:string }) {
        // variables

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.configMunicipioWhereInput = {}

        const responseService = await this.service.paginate({ filter, skip, take });

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

        const filter: Prisma.configMunicipioWhereInput = { id };
        const responseService = this.service.find({ filter });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    private async update(@Req() req: any, @Param() param: { id: string }, @Body() body: MunicipioCreate) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones

        // lógica
        const id = param.id;
        const currentBody: MunicipioCreate = {
            name: body.name,
            userId: user.id,
            estadoId: body.estadoId
        }

        const responseService = this.service.udpate({ id,data:currentBody });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_LINE_UPDATE,
            objectId: id,
            objectName: `municipio`,
            objectReference: `municipio`,
            userId: req.user.id ? req.user.id : `no_user`
        });

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
            eventName: this.appEvent.EVENT_LINE_DELETE,
            objectId: id,
            objectName: `municipio`,
            objectReference: `municipio`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }

    @Put(`:id/recovery`)
    @UseGuards(AuthGuard)
    private async recovery(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        // lógica
        const id = param.id;

        const responseService = this.service.recovery({ id });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_LINE_RECOVERY,
            objectId: id,
            objectName: `municipio`,
            objectReference: `municipio`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }

    @Get(`/report/many`)
    @UseGuards(AuthGuard)
    private async report(@Req() req: any) {
        // variables
        let filter: Prisma.configMunicipioWhereInput = {deleteAt:null}

        const count = await this.model.count({filter});
        let now = 0;
        let skip = 0;
        let take = 15;

        const page: any[] = []; 

        // permisos

        // lógica

        let select: Prisma.configMunicipioSelect = {};
        let header: string[] = [];
        let label: string[]  = [];

        select = { name: true,_count:{select:{parroquias:true}}, createAt: true,createByRef: true };
        header = [``,`Nombre`,`Proyectos`,`Creador`,``,`Creación`];
        label = [`name`,`_count.projects`,`createByRef.name`,`createByRef.lastname`,`createAt`];

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
        const historyPromise = this.getCustomHistory(param.id);

        const dataPromise = this.model.find({ filter:{ id:param.id } });

        const header = [`Nombre:`,`Creado por:`,`Fecha creación:`,`Última actualización`];
        const label = [`name`,`createByRef.email`,`createAt`,`updateAt`];

        const data = await dataPromise;
        const history = await historyPromise;
        
        return {
            data,
            history: history,
            header,
            label,  
        };
    }

    private async getCustomHistory(id:string) {
        return { count:0, list:[] }
        let filter: Prisma.configMunicipioWhereInput = {deleteAt:null}
        const count = await this.model.count({filter});
        let now = 0;
        let skip = 0;
        let take = 20;

        const currentList = [];

        // permisos

        // lógica

        let select: Prisma.configMunicipioSelect = {};
        let data: string[][] = [];
        let label: string[]  = [];

        select = { name: true,_count:{select:{parroquias:true}}, createAt: true,createByRef: true };
        data.push([`Descripción`,`Usuario`,``,`Fecha`]);
        data.push([`description`,`createByRef.name`,`createByRef.lastname`,`createAt`]);

        do {
            const find = await this.model.findAll({ skip, take, filter, select });
            currentList.push(find);
            skip = skip + take;
            now = now + take
        } while (now < count);

        return {
            count,
            list: currentList
        }
    }

    private async RegisterHistory (data: HistoryCreate) {
        await this.history.create({ data });
    }
}
