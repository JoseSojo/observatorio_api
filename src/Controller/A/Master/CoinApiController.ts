import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PERMIT_COIN } from 'src/Fixtures/CurrentPermit';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { GlobalService } from 'src/Service/GlobalService';
import { CoinService } from 'src/Service/Master/CoinService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { NotificationService } from 'src/Service/User/NotificationService';
import { ValidationService } from 'src/Service/ValidationService';
import { BaseStaticticsPie } from 'src/Validation/Event';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateCoinType, UpdateCoinType } from 'src/Validation/Master/CreateCoinType';
import { TranslateType } from 'src/Validation/Translate';
import { FORM } from 'src/Validation/UI/Form/GenericForm';

@Controller('/coin')
export class CoinApiController {

    private lang: TranslateType;

    constructor(
        private coin: CoinService,
        private permitFactory: PermitsFactory,
        private global: GlobalService,
        private translate: LanguajeService,
        private notification: NotificationService,
        private validation: ValidationService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_COIN);
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

        const responseService = await this.coin.FindCoin(param.id);
        return {...responseService, actions, update: this.coin.getFormUpdate(responseService.body), delete:this.coin.getFromDelete(param.id)};
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_COIN);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        let skip = query.skip ? Number(query.skip) : 0;
        let take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.coin.FindAllCoin({ filter: [], skip, take });
        return {...responseService, pie:this.staticticsPie()};
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateCoinType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_COIN);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if(!this.validation.name(body.name)) return { error:true, message: this.lang.Required.NAME };
        if(!this.validation.description(body.description)) return { error:true, message: this.lang.Required.DESCRIPTION };
        if(!this.validation.prefix(body.prefix)) return { error:true, message: this.lang.Required.PREFIX };
        
        const data: Prisma.CoinCreateInput = {
            createByReference: { connect:{ id:user.id } },
            description: body.description,
            name: body.name,
            prefix: body.prefix,
        }

        const responseService = await this.coin.CreateCoin(data);

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateCoinType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_COIN);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.update });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: `Name required` }

        let data: Prisma.CoinUpdateInput = {
            name: body.name,
            description: body.description,
            prefix: body.prefix
        }

        const responseService = await this.coin.UpdateCoin(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_COIN);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.coin.DelteCoin(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_COIN);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.recovery });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.coin.RestoreCoin(param.id);
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
        return [{name:`coin_in_payment`}];
    }
}
