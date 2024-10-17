import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { PaymentMethodService } from 'src/Service/Master/PaymentMethodService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { UpdateCountryType } from 'src/Validation/Master/CreateCountryType';
import { CreatePaymentMethodType } from 'src/Validation/Master/CreatePaymentMethodType';
import { TranslateType } from 'src/Validation/Translate';

@Controller('/payment_method')
export class PaymentMethodApiController {
    private lang: TranslateType;

    constructor(
        private payment: PaymentMethodService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_PAYMENT_METHOD_UNIQUE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.payment.FindPaymentMethod(param.id);
        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = `APP_MASTER_PAYMENT_METHOD_LIST`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.payment.FindAllPaymentMethod({ filter: [], skip, take });
        return responseService;
    }

    @Post(`new`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreatePaymentMethodType, @Req() req: any) {
        const permitForAction = `APP_MASTER_PAYMENT_METHOD_CREATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        
        const data: Prisma.PaymentMethodCreateInput = {
            createByReference: { connect:{ id:user.id } },
            name: body.name,
            description: body.description,
            moneyReference: { connect:{ id:body.coinId } }

        }

        const responseService = await this.payment.CreatePaymentMethod(data);

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateCountryType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_PAYMENT_METHOD_UDPATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: `Name required` }

        let data: Prisma.CoinUpdateInput = {
            name: body.name,
        }

        const responseService = await this.payment.UpdatePaymentMethod(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_PAYMENT_METHOD_DELETE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.payment.DeltePaymentMethod(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_PAYMENT_METHOD_RECOVERY`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.payment.RestorePaymentMethod(param.id);
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
