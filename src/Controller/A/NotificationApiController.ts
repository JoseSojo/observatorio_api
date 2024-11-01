import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PERMIT_NOTIFICATION } from 'src/Fixtures/CurrentPermit';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { GlobalService } from 'src/Service/GlobalService';
import { CityService } from 'src/Service/Master/CityService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { NotificationService } from 'src/Service/User/NotificationService';
import { UserService } from 'src/Service/User/UserService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { TranslateType } from 'src/Validation/Translate';
import { CreateUserType, UpdatePassowrdUserType, UpdateUserType } from 'src/Validation/User/CreateType';

@Controller('/notification')
export class NotificationApiController {

    private lang: TranslateType;

    constructor(
        private notification: NotificationService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private global: GlobalService,
        private city: CityService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_NOTIFICATION);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.notification.FindNotification({ filter:[{id:param.id}] });
        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string, type:`by` | `for` }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_NOTIFICATION);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.NotificationWhereInput[] = [];
        if(query.type == `by`) filter.push({ userById:user.id });
        else filter.push({ userForId:user.id });
        
        const responseService = await this.notification.FindAllNotification({ filter: filter, skip, take });
        return responseService;
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateUserType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_NOTIFICATION);;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        // let data: Prisma.NotificationCreateInput = {
        //     content: ``,
        //     userForReference: {  }
        // } 
        // const responseService = await this.user.CreateNewUser(data);

        // return responseService;
        return {}
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_NOTIFICATION);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.notification.DelteNotification(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_NOTIFICATION);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.recovery });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.notification.RestoreNotification(param.id);
        return responseService;
    }

    private userFound(req: RequetsUser) {
        const found = req.user;

        if (!found) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'This is a custom message',
            }, HttpStatus.FORBIDDEN, {
                cause: null
            });
        }

        return found;
    }
}
