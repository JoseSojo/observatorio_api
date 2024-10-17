import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { ConfigCountryService } from 'src/Service/Master/CountryService';
import { SubscriptionService } from 'src/Service/Master/SubscriptionService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateCountryType, UpdateCountryType } from 'src/Validation/Master/CreateCountryType';
import { CreateSubscriptionType, UpdateSubscriptionType } from 'src/Validation/Master/CreateSubscriptionType';
import { TranslateType } from 'src/Validation/Translate';

@Controller('/subscription')
export class SubscriptionApiController {

    private lang: TranslateType;

    constructor(
        private subscription: SubscriptionService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_SUBSCRIPTION_UNIQUE`;
        const user = this.userFound(req);
        const roles = req.subscription.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.FindSubscription(param.id);
        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = `APP_MASTER_SUBSCRIPTION_LIST`;
        const user = this.userFound(req);
        const roles = req.subscription.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.FindAllSubscription({ filter: [], skip, take });
        return responseService;
    }

    @Post(`new`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateSubscriptionType, @Req() req: any) {
        const permitForAction = `APP_MASTER_SUBSCRIPTION_CREATE`;
        const user = this.userFound(req);
        const roles = req.subscription.rolReference.roles

        if(!body.name) return { error: true, message: this.lang.Required.NAME }
        if(!body.countMonth) return { error: true, message: this.lang.Required.COIN }
        if(!body.discount) return { error: true, message: this.lang.Required.PREFIX }

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        
        const data: Prisma.SubscriptionCreateInput = {
            createByReference: { connect:{ id:user.id } },
            name: body.name,
            countMonth: body.countMonth,
            discount: body.discount
        }

        const responseService = await this.subscription.CreateSubscription(data);

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateSubscriptionType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_SUBSCRIPTION_UDPATE`;
        const user = this.userFound(req);
        const roles = req.subscription.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if(!body.name) return { error: true, message: this.lang.Required.NAME }
        if(!body.countMonth) return { error: true, message: this.lang.Required.COIN }
        if(!body.discount) return { error: true, message: this.lang.Required.PREFIX }

        let data: Prisma.ConfigCountryUpdateInput = {
            name: body.name
        }

        const responseService = await this.subscription.UpdateSubscription(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_SUBSCRIPTION_DELETE`;
        const user = this.userFound(req);
        const roles = req.subscription.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.DelteSubscription(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_SUBSCRIPTION_RECOVERY`;
        const user = this.userFound(req);
        const roles = req.subscription.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.subscription.RestoreSubscription(param.id);
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
