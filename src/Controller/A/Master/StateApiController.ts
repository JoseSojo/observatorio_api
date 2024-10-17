import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { StateService } from 'src/Service/Master/StateService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateStateType, UpdateStateType } from 'src/Validation/Master/CreateStateType';
import { TranslateType } from 'src/Validation/Translate';

@Controller('/state')
export class StateApiController {
    private lang: TranslateType;

    constructor(
        private user: StateService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COUNTRY_UNIQUE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindConfigState(param.id);
        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = `APP_MASTER_COUNTRY_LIST`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindAllConfigState({ filter: [], skip, take });
        return responseService;
    }

    @Post(`new`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateStateType, @Req() req: any) {
        const permitForAction = `APP_MASTER_COUNTRY_CREATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        
        const data: Prisma.ConfigStateCreateInput = {
            createByReference: { connect:{ id:user.id } },
            countryReference: { connect:{ id:body.countryId } },
            name: body.name,
        }

        const responseService = await this.user.CreateState(data);

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateStateType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COUNTRY_UDPATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: `Name required` }

        let data: Prisma.ConfigStateUpdateInput = {
            name: body.name,
        }

        const responseService = await this.user.UpdateConfigState(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COUNTRY_DELETE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.DelteConfigState(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_MASTER_COUNTRY_RECOVERY`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.RestoreConfigState(param.id);
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
