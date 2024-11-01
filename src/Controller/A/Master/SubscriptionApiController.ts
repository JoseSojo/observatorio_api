import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PERMIT_SUBSCRIPTION } from 'src/Fixtures/CurrentPermit';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { GlobalService } from 'src/Service/GlobalService';
import { ConfigCountryService } from 'src/Service/Master/CountryService';
import { SubscriptionService } from 'src/Service/Master/SubscriptionService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { NotificationService } from 'src/Service/User/NotificationService';
import { ValidationService } from 'src/Service/ValidationService';
import { BaseStaticticsPie } from 'src/Validation/Event';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateCountryType, UpdateCountryType } from 'src/Validation/Master/CreateCountryType';
import { CreateSubscriptionType, UpdateSubscriptionType } from 'src/Validation/Master/CreateSubscriptionType';
import { TranslateType } from 'src/Validation/Translate';
import { FORM } from 'src/Validation/UI/Form/GenericForm';

@Controller('/subscription')
export class SubscriptionApiController {

    private lang: TranslateType;

    constructor(
        private subscription: SubscriptionService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private notification: NotificationService,
        private global: GlobalService,
        private validation: ValidationService,
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_SUBSCRIPTION);;
        const user = req.user as any;
        const roles = user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.unique });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.FindSubscription(param.id);
    
        const actions: {name:string,id:string,color:string,update?:FORM}[] = [];

        actions.push({ id:param.id, name:this.lang.Titles.Sections.history, color:`history` });
        if(roles.includes(permitForAction.update)) actions.push({ 
            id:param.id, name:this.lang.Titles.Form.update, color:`update`
        });

        if(roles.includes(permitForAction.delete)) actions.push({
            id:param.id, name:this.lang.Titles.Form.update, color:`delete`,
        });

        return {...responseService, actions, update: this.subscription.getFormUpdate(responseService.body), delete:this.subscription.getFromDelete(param.id)};;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_SUBSCRIPTION);
        const user = req.user as any;
        const roles = user.rolReference.roles        

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.FindAllSubscription({ filter: [], skip, take });
        return {...responseService, pie:this.staticticsPie()};;
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateSubscriptionType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_SUBSCRIPTION);
        const user = req.user as any;
        const roles = user.rolReference.roles

        body.countMonth = body.countMonth ? Number(body.countMonth) : undefined;
        body.discount = body.discount ? Number(body.discount) : undefined;

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if(!this.validation.number(body.countMonth)) return { message:this.lang.Required.FREE_MONTH ,error:true };
        if(!this.validation.name(body.name)) return { message:this.lang.Required.NAME ,error:true };
        
        const data: Prisma.SubscriptionCreateInput = {
            createByReference: { connect:{ id:user.id } },
            name: body.name,
            countMonth: body.countMonth,
            discount: body.discount
        }

        const responseService = await this.subscription.CreateSubscription(data);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.create.subscription, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.create.subscription, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateSubscriptionType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_SUBSCRIPTION);
        const user = req.user as any;
        const roles = user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.update });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if(!body.name) return { error: true, message: this.lang.Required.NAME }
        if(!body.countMonth) return { error: true, message: this.lang.Required.COIN }
        if(!body.discount) return { error: true, message: this.lang.Required.PREFIX }

        let data: Prisma.ConfigCountryUpdateInput = {
            name: body.name
        }

        const responseService = await this.subscription.UpdateSubscription(param.id, data);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.udpate.subscription, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.udpate.subscription, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_SUBSCRIPTION);
        const user = req.user as any;
        const roles = user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.DelteSubscription(param.id);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.delete.subscription, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.delete.subscription, userByReference:{connect:{id:user.id}} });

        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_SUBSCRIPTION);
        const user = req.user as any;
        const roles = user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.recovery });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.RestoreSubscription(param.id);
        if(responseService.error) await this.notification.CreateNewNotification({ content:this.lang.Notification.recovery.subscription, userByReference:{connect:{id:user.id}} });
        else await this.notification.CreateNewNotification({ content:this.lang.Notification.recovery.subscription, userByReference:{connect:{id:user.id}} });

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
        return [{name:`user_in_subscription`}];
    }
}
