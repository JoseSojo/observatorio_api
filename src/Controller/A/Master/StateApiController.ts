import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PERMIT_STATE } from 'src/Fixtures/CurrentPermit';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { GlobalService } from 'src/Service/GlobalService';
import { StateService } from 'src/Service/Master/StateService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { NotificationService } from 'src/Service/User/NotificationService';
import { ValidationService } from 'src/Service/ValidationService';
import { BaseStaticticsPie } from 'src/Validation/Event';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateStateType, UpdateStateType } from 'src/Validation/Master/CreateStateType';
import { TranslateType } from 'src/Validation/Translate';
import { FORM } from 'src/Validation/UI/Form/GenericForm';

@Controller('/state')
export class StateApiController {
    private lang: TranslateType;

    constructor(
        private state: StateService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private global: GlobalService,
        private notification: NotificationService,
        private validation: ValidationService,
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_STATE);
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

        const responseService = await this.state.FindConfigState(param.id);
        return {...responseService, actions, update: this.state.getFormUpdate(responseService.body), delete:this.state.getFromDelete(param.id)};;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_STATE);;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles


        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.state.FindAllConfigState({ filter: [], skip, take });
        return {...responseService, pie:this.staticticsPie()};
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateStateType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_STATE);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if(!this.validation.id(body.countryId)) return { message:this.lang.Required.COIN ,error:true };
        // if(!this.validation.description(body.permits)) return { message:this.lang.Required.COIN ,error:true };
        if(!this.validation.name(body.name)) return { message:this.lang.Required.COIN ,error:true };
        

        const data: Prisma.ConfigStateCreateInput = {
            createByReference: { connect:{ id:user.id } },
            countryReference: { connect:{ id:body.countryId } },
            name: body.name,
        }

        const responseService = await this.state.CreateState(data);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.create.state, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.create.state, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateStateType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_STATE);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.update });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: `Name required` }

        let data: Prisma.ConfigStateUpdateInput = {
            name: body.name,
        }

        const responseService = await this.state.UpdateConfigState(param.id, data);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.udpate.state, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.udpate.state, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_STATE);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.state.DelteConfigState(param.id);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.delete.state, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.delete.state, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_STATE);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.recovery });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.state.RestoreConfigState(param.id);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.recovery.state, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.recovery.state, userByReference:{connect:{id:user.id}} });

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
        return [{name:`city_in_state`}];
    }
}
