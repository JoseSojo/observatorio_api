import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PERMIT_PERMIT } from 'src/Fixtures/CurrentPermit';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { GlobalService } from 'src/Service/GlobalService';
import { PermitService } from 'src/Service/Master/PermitService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { NotificationService } from 'src/Service/User/NotificationService';
import { ValidationService } from 'src/Service/ValidationService';
import { BaseStaticticsPie } from 'src/Validation/Event';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreatePermitType, UpdatePermitType } from 'src/Validation/Master/CreatePermitType';
import { TranslateType } from 'src/Validation/Translate';
import { FORM } from 'src/Validation/UI/Form/GenericForm';

@Controller('/permit')
export class PermitApiController {

    private lang: TranslateType;

    constructor(
        private permit: PermitService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private notification: NotificationService,
        private global: GlobalService,
        private validation: ValidationService
    ) { 
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_PERMIT);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.unique });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const actions: {name:string,id:string,color:string,update?:FORM}[] = [];

        actions.push({ id:param.id, name:this.lang.Titles.Sections.history, color:`history` });
        if(roles.includes(permitForAction.update)) actions.push({ 
            id:param.id, name:this.lang.Titles.Form.update, color:`update`
        });

        if(roles.includes(permitForAction.delete)) actions.push({
            id:param.id, name:this.lang.Titles.Form.update, color:`delete`,
        });

        const responseService = await this.permit.FindConfigPermit(param.id);
        return {...responseService, actions, update: this.permit.getFormUpdate(responseService.body), delete:this.permit.getFromDelete(param.id)};;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_PERMIT);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles;

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.permit.FindAllConfigPermit({ filter: [], skip, take });
        return {...responseService, pie:this.staticticsPie()};
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreatePermitType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_PERMIT);;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        // if(!this.validation.id(body.userId)) return { message:this.lang.Required.USERNAME ,error:true };
        // if(!this.validation.description(body.permits)) return { message:this.lang.Required.COIN ,error:true };
        if(!this.validation.name(body.name)) return { message:this.lang.Required.NAME ,error:true };
        

        const responseService = await this.permit.CreatePermit({ name:body.name, roles:body.permits, userId:user.id });
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.create.permit, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.create.permit, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdatePermitType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_PERMIT);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.update });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!this.validation.name) return { error: true, body: null, message: this.lang.Required.NAME }

        let data: Prisma.PermitsUpdateInput = {
            name: body.name,
            roles: body.roles
        }

        const responseService = await this.permit.UpdateConfigPermit(param.id, data);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.udpate.permit, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.udpate.permit, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_PERMIT);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.permit.DelteConfigPermit(param.id);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.delete.permit, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.delete.permit, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_PERMIT);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.recovery });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.permit.RestoreConfigPermit(param.id);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.recovery.permit, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.recovery.permit, userByReference:{connect:{id:user.id}} });

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

    private staticticsPie(): BaseStaticticsPie[] {
        return [{name:`user_in_permit`}];
    }
}
