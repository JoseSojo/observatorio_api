import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { CityService } from 'src/Service/Master/CityService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { CreateCityType, UpdateCityType } from 'src/Validation/Master/CreateCityType';
import { TranslateType } from 'src/Validation/Translate';
import { PERMIT_CITY } from 'src/Fixtures/CurrentPermit';
import { GlobalService } from 'src/Service/GlobalService';
import { ValidationService } from 'src/Service/ValidationService';
import { FormType } from 'src/Validation/UI/Form/FormType';
import { FORM } from 'src/Validation/UI/Form/GenericForm';
import { NotificationService } from 'src/Service/User/NotificationService';
import { BaseStaticticsPie } from 'src/Validation/Event';

@Controller('/city')
export class CityApiController {

    private lang: TranslateType;

    constructor(
        private city: CityService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private global: GlobalService,
        private validation: ValidationService,
        private notification: NotificationService
    ) { 
        this.lang = this.translate.GetTranslate()
    }

    @Get(`/:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_CITY);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const actions: {name:string,id:string,color:string,update?:FORM}[] = [];

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.unique });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.city.FindConfigCity(param.id);

        actions.push({ id:param.id, name:this.lang.Titles.Sections.history, color:`history` });
        if(roles.includes(permitForAction.update)) actions.push({ 
            id:param.id, name:this.lang.Titles.Form.update, color:`update`
        });

        if(roles.includes(permitForAction.delete)) actions.push({
            id:param.id, name:this.lang.Titles.Form.update, color:`delete`,
        });

        return {...responseService, actions, update: this.city.getFormUpdate(responseService.body), delete:this.city.getFromDelete(param.id)};
    }

    @Get(`/`)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_CITY).list;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const pie = this.staticticsPie();

        const responseService = await this.city.FindAllConfigCity({ filter: [], skip, take });
        return {...responseService, pie};
    }

    @Post(`/create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateCityType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_CITY);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if(!this.validation.name(body.name)) return { error: true, message: this.lang.Required.NAME }
        if(!this.validation.id(body.stateId)) return { error: true, message: this.lang.Required.STATE }
        
        const data: Prisma.ConfigCityCreateInput = {
            createByReference: { connect:{ id:user.id } },
            name: body.name,
            stateReference: { connect:{ id:body.stateId } }
        }

        const responseService = await this.city.CreateCity(data);

        return responseService;
    }

    @Put(`/:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateCityType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_CITY);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.update });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }
        
        if(!this.validation.name(body.name)) return { error: true, message: this.lang.Required.NAME }

        let data: Prisma.ConfigCityUpdateInput = {
            name: body.name
        }

        const responseService = await this.city.UpdateConfigCity(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_CITY);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.city.DelteConfigCity(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_CITY).recovery;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.city.RestoreConfigCity(param.id);
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
        return [{name:`user_in_city`}];
    }
}
