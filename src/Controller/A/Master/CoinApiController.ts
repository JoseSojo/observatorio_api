import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { CoinService } from 'src/Service/Master/CoinService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateCoinType, UpdateCoinType } from 'src/Validation/Master/CreateCoinType';
import { TranslateType } from 'src/Validation/Translate';

@Controller('/coin')
export class CoinApiController {

    private lang: TranslateType;

    constructor(
        private user: CoinService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COIN_UNIQUE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindCoin(param.id);
        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = `APP_MASTER_COIN_LIST`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindAllCoin({ filter: [], skip, take });
        return responseService;
    }

    @Post(`new`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateCoinType, @Req() req: any) {
        const permitForAction = `APP_MASTER_COIN_CREATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        
        const data: Prisma.CoinCreateInput = {
            createByReference: { connect:{ id:user.id } },
            description: body.description,
            name: body.name,
            prefix: body.prefix,
        }

        const responseService = await this.user.CreateCoin(data);

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateCoinType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COIN_UDPATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: `Name required` }
        if (!body.description) return { error: true, body: null, message: `description  required` }
        if (!body.prefix) return { error: true, body: null, message: `prefix required` }

        let data: Prisma.CoinUpdateInput = {
            name: body.name,
            description: body.description,
            prefix: body.prefix
        }

        const responseService = await this.user.UpdateCoin(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COIN_DELETE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.DelteCoin(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COIN_RECOVERY`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.RestoreCoin(param.id);
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
