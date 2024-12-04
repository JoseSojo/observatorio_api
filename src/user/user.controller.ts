import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { LanguajeService } from "src/languaje/languaje.service";
import { LanguajeInterface } from "src/languaje/guard/languaje.interface";
import { Prisma } from "@prisma/client";
import { UserService } from "./user.service";
import { UserCreate } from "./guards/user.guard";
import { AuthGuard } from "src/guards/AuthGuard";
import AppPermit from "src/permit/module/app.permit";
import { PermitService } from "src/permit/permit.service";
import { HistoryCreate } from "src/history/guards/history.guard";
import { HistoryService } from "src/history/history.service";
import AppEvent from "src/AppEvent";

interface Contact_Data_Interface {
    phone?: string,
    phone2?: string,
    email?: string,
    email2?: string
}

interface Residence_Data_Interface {
    state?: {
        label: string,
        value: string,
        name: string
    },
    municipio?: {
        label: string,
        value: string,
        name: string
    },
    parroquia?: {
        label: string,
        value: string,
        name: string
    },
}

interface Perosnal_Data_Interface {
    name?: string;
    name2?: string;
    lastname?: string;
    lastname2?: string;
    nacionality?: string;
    ci?: string;
    birthdate?: string;
    age?: string;
    civil?: string;
    sex?: string;
}

interface CUTSOM_INTERFACE_UPDATE extends Perosnal_Data_Interface  {
    phone?: string,
    phone2?: string,
    email?: string,
    email2?: string,
    residence?: Residence_Data_Interface
}

@Controller(`user`)
export class UserController {

    private lang: LanguajeInterface;

    constructor(
        private languaje: LanguajeService,
        private service: UserService,
        private permit: AppPermit,
        private permitService: PermitService,
        private history: HistoryService,
        private appEvent: AppEvent,
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    private async create(@Req() req: any, @Body() body: UserCreate) {
        // variables
        const user = req.user as any;

        // permisos

        // validaciones

        // const studentResult = await this.permitService.find({ filter:{ name:this.permit.ESTUDIANTE } });
        // const student = studentResult.body;

        // lógica
        const currentBody: UserCreate = {
            name: body.name,
            email: body.email,
            lastname: body.lastname,
            password: body.password,
            rolId: body.rolId,
            username: body.username,
            parentId: user.id
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

        let customFilter: Prisma.userWhereInput = { name: this.permit.ESTUDIANTE };

        if (user.rolReference.name === this.permit.SUPER_ADMIN) {
            customFilter = { OR: [{ rolReference: { name: this.permit.COODINADOR } }, { rolReference: { name: this.permit.ESTUDIANTE } }, { rolReference: { name: this.permit.ANALISTA } }] }
        } else if (user.rolReference.name === this.permit.COODINADOR) {
            customFilter = { rolReference: { name: this.permit.ESTUDIANTE } };
        }

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

        const filter: Prisma.userWhereInput = { id };
        const responseService = await this.service.find({ filter });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    private async update(@Req() req: any, @Param() param: { id: string }, @Body() body: CUTSOM_INTERFACE_UPDATE) {
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

        const responseService = await this.service.udpate({ id, data: currentBody });

        await this.RegisterHistory({
            ip: req.ip,
            browser: req.headers['user-agent'].toString(),
            eventName: this.appEvent.EVENT_USER_UPDATE,
            objectId: id,
            objectName: `user`,
            objectReference: `user`,
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
