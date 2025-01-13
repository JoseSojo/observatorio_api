import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { LanguajeService } from "src/languaje/languaje.service";
import { LanguajeInterface } from "src/languaje/guard/languaje.interface";
import { Prisma } from "@prisma/client";
import { WorkService } from "./work.service";
import { WorkCreate,WorkUpdate } from "./guards/work.guard";
import { AuthGuard } from "src/guards/AuthGuard";
import AppPermit from "src/permit/module/app.permit";
import { PermitService } from "src/permit/permit.service";
import { HistoryCreate } from "src/history/guards/history.guard";
import { HistoryService } from "src/history/history.service";
import AppEvent from "src/AppEvent";

@Controller(`work`)
export class WorkController {

    private lang: LanguajeInterface;

    constructor(
        private languaje: LanguajeService,
        private service: WorkService,
        private history: HistoryService,
        private appEvent: AppEvent,
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    private async create(@Req() req: any, @Body() body: WorkCreate) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones
        if (!body.cargo) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.work.cargo, error: true }
        if (!body.institucion) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.work.institucion, error: true }
        if (!body.dateStart) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.work.dateStart, error: true }
        if (!body.ocupacion) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.work.ocupacion, error: true }
        if (!body.tipoInstitucion) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.work.type, error: true }
        
        // fecha fin
        if (body.actual === false && !body.dateEnd) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.work.dateEnd, error: true }

        // const studentResult = await this.permitService.find({ filter:{ name:this.permit.ESTUDIANTE } });
        // const student = studentResult.body;

        // lógica
        const currentBody: WorkCreate = {
            institucion: body.institucion,
            userId: user.id,
            actual: body.actual ? true : false,
            tipoInstitucion: body.tipoInstitucion,
            ocupacion: body.ocupacion,
            cargo: body.cargo,
            dateStart: new Date(body.dateStart),
            dateEnd: body.dateEnd ? new Date(body.dateEnd) : undefined,
        }

        const responseService = await this.service.create({ data: currentBody }) as any;

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_USER_CREATE,
            objectId: responseService.body.id ? responseService.body.id : responseService.body.id,
            objectName: `user`,
            objectReference: `user`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }

    @Get(`my`)
    @UseGuards(AuthGuard)
    private async paginateMy(@Req() req: any, @Query() query: { skip: string, take: string, param?: string }) {
        // variables
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        let customFilter: Prisma.workProfileWhereInput = {};

        if(query.param) customFilter = { OR:[
            {cargo:{contains:query.param}},
            {institucion:{contains:query.param}},
            {ocupacion:{contains:query.param}},
            {tipoInstitucion:{contains:query.param}},
        ]}
        const responseService = await this.service.paginate({ filter: {AND:[{...customFilter},{userId:user.id}]}, skip, take });

        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    private async paginate(@Req() req: any, @Query() query: { skip: string, take: string, param?: string }) {
        // variables
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        let customFilter: Prisma.workProfileWhereInput = {};

        if(query.param) customFilter = { OR:[
            {cargo:{contains:query.param}},
            {institucion:{contains:query.param}},
            {ocupacion:{contains:query.param}},
            {tipoInstitucion:{contains:query.param}},
        ]}
        const responseService = await this.service.paginate({ filter: customFilter, skip, take });

        return responseService;
    }

    @Get(`:id/unique`)
    @UseGuards(AuthGuard)
    private async unique(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        // lógica
        const id = param.id;

        const filter: Prisma.workProfileWhereInput = { id };
        const responseService = await this.service.find({ filter });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    private async update(@Req() req: any, @Param() param: { id: string }, @Body() body: any) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones

        const date = new Date();
        // lógica
        const id = param.id;
        const currentBody: Prisma.userUpdateInput = {
            name: body.name,
            secondName: body.name2,
            email: body.email,
            lastname: body.lastname,
            secondLastname: body.lastname2,
            age: body.age ? Number(body.age) : 0,
            birtdate: new Date(body.birthdate),
            ci: body.ci,
            email2: body.email2,
            estadoCivil: body.civil,
            nacionality: body.nacionality,
            phone: body.phone,
            phone2: body.phone2,
            sexo: body.sex === `M` ? `M` : `F`,
            parroquiaReference: { connect:{ id:body.residence.parroquia.value } }
        }

        // const responseService = await this.service.udpate({ id, data: currentBody });

        // await this.RegisterHistory({
        //     ip: req.ip,
        //     browser: req.headers['user-agent'].toString(),
        //     eventName: this.appEvent.EVENT_USER_UPDATE,
        //     objectId: id,
        //     objectName: `user`,
        //     objectReference: `user`,
        //     userId: req.user.id ? req.user.id : `no_user`
        // });

        return {} // responseService;
    }

    @Put(`:id/delete`)
    @UseGuards(AuthGuard)
    private async delete(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        // lógica
        const id = param.id;

        const responseService = await this.service.delte({ id });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_USER_DELETE,
            objectId: id,
            objectName: `user`,
            objectReference: `user`,
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
            eventName: this.appEvent.EVENT_USER_RECOVERY,
            objectId: id,
            objectName: `user`,
            objectReference: `user`,
            userId: req.user.id ? req.user.id : `no_user`
        });

        return responseService;
    }

    private async RegisterHistory(data: HistoryCreate) {
        await this.history.create({ data });
    }
}
