import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { HistoryService } from 'src/Service/HistoryService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { UserService } from 'src/Service/User/UserService';
import { TranslateType } from 'src/Validation/Translate';
import { CreateUserType } from 'src/Validation/User/CreateType';

@Controller('/history')
export class HistoryApiController {

    private lang: TranslateType;

    constructor(
        private user: UserService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private history: HistoryService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = `APP_USER_LIST`;
        const user = req.user;
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindAllUser({ filter: [], skip, take });
        return responseService;
    }

    @Get(`object`)
    @UseGuards(AuthGuard)
    public async paginateObeject(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string, objectId:string }) {
        // const permitForAction = `APP_USER_LIST`;
        const user = req.user;
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        // const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        // if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        let filter: Prisma.HistoryWhereInput = {}

        if(query.objectId) filter = {...filter, objectReferenceId:query.objectId };

        const responseService = await this.history.FindAllConfigHistory({ filter, skip, take });
        return responseService;
    }
}
