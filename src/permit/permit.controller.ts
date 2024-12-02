import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/AuthGuard';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { LanguajeService } from 'src/languaje/languaje.service';
import { PermitService } from './permit.service';
import { Prisma } from '@prisma/client';

@Controller('permit')
export class PermitController {
    private lang: LanguajeInterface;

    constructor(
        private languaje: LanguajeService,
        private service: PermitService,
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @Get(``)
    @UseGuards(AuthGuard)
    private async paginate(@Req() req: any, @Query() query: { skip:string, take:string, param?:string }) {
        // variables

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.userGroupWhereInput = {}

        const responseServicePromise = this.service.paginate({ filter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;
    }

    @Get(`:id/unique`)
    @UseGuards(AuthGuard)
    private async unique(@Req() req: any, @Param() param: { id: string }) {
        // variables

        // permisos

        // lógica
        const id = param.id;

        const filter: Prisma.userGroupWhereInput = { id };
        const responseService = this.service.find({ filter });

        return responseService;
    }
}
