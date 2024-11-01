import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { PERMIT_USER } from 'src/Fixtures/CurrentPermit';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { GlobalService } from 'src/Service/GlobalService';
import { CityService } from 'src/Service/Master/CityService';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { UserService } from 'src/Service/User/UserService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { TranslateType } from 'src/Validation/Translate';
import { FORM } from 'src/Validation/UI/Form/GenericForm';
import { CreateUserType, UpdatePassowrdUserType, UpdateUserType } from 'src/Validation/User/CreateType';

@Controller('/user')
export class UserApiController {

    private lang: TranslateType;

    constructor(
        private user: UserService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService,
        private global: GlobalService,
        private city: CityService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_USER);
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

        const responseService = await this.user.FindUser({ filter:[{id:param.id}] });
        return {
            ...responseService, 
            actions, 
            update: this.user.getFormUpdate(), 
            delete:this.user.getFromDelete(param.id)
        };
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_USER);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.list });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindAllUser({ filter: [], skip, take });
        return responseService;
    }

    @Post(`create`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateUserType, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_USER);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.create });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.email) return { error: true, body: null, message: this.lang.User.EMAIL_FOUND }
        if (!body.username) return { error: true, body: null, message: this.lang.User.USERNAME_FOUND }
        if (!body.password) return { error: true, body: null, message: this.lang.User.EMAIL_FOUND }

        let data: Prisma.UserCreateInput = {
            email: body.email,
            password: body.password,
            username: body.username
        }

        if (body.cityId) { data = { ...data, cityReference: { connect: { id: body.cityId } } }; }
        if (body.name) { data = { ...data, name: body.name }; }
        if (body.lastname) { data = { ...data, lastname: body.lastname }; }
        if (body.roleId) { data = { ...data, rolReference: { connect: { id: body.roleId } } }; }



        const responseService = await this.user.CreateNewUser(data);

        return responseService;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    public async update(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_USER);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.update });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: this.lang.User.EMAIL_FOUND }
        if (!body.lastname) return { error: true, body: null, message: this.lang.Required.LASTNAME }
        if (!body.email) return { error: true, body: null, message: this.lang.Required.EMAIL }
        if (!body.username) return { error: true, body: null, message: this.lang.Required.PASSWORD }
        if (!body.password) return { error: true, body: null, message: this.lang.Required.PASSWORD }

        let data: Prisma.UserUpdateInput = {
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            username: body.username,
            cityReference: { connect: { id: body.cityId } }
        }

        const responseService = await this.user.UpdateUser(param.id, data);
        return responseService;
    }

    @Put(`:id/profile`)
    @UseGuards(AuthGuard)
    public async profile(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_PROFILE_UPDATE_DATA`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles
        const cityFound = this.city.FindConfigCity(body.cityId);

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        // if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        if (!body.name) return { error: true, body: null, message: this.lang.Required.NAME }
        if (!body.lastname) return { error: true, body: null, message: this.lang.Required.LASTNAME }
        if (!body.email) return { error: true, body: null, message: this.lang.Required.EMAIL }
        if (!body.username) return { error: true, body: null, message: this.lang.Required.PASSWORD }
        // if (!body.password) return { error: true, body: null, message: this.lang.Required.PASSWORD }

        let data: Prisma.UserUpdateInput = {
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            username: body.username,
        }

        const city = await cityFound
        if(city.body && body.cityId != user.cityId) data = {...data, cityReference: {connect:{id:body.cityId}} };

        const responseService = await this.user.UpdateUser(param.id, data);
        return responseService;
    }

    @Put(`:id/profile/password`)
    @UseGuards(AuthGuard)
    public async profilePassword(@Body() body: UpdatePassowrdUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_PROFILE_UPDATE_PASSWORD`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        // if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const userFound = await this.user.FindUser({ filter:[{ id:param.id }] })
        if(!userFound) return { error: true, message: this.lang.User.USERNAME_FOUND }

        const comparePromise = this.global.Compare({ password:body.nowPassword, dbPassword:userFound.body.password });
        if(body.newPassword != body.repeatPassword) return { error:true, message: this.lang.Action.PASSWORD_NOT_MATCH }

        const compare = await comparePromise;
        if(!compare) return { error:true, message: this.lang.Action.PASSWORD_NOT_VALID }

        const password = await this.global.Hash({ password: body.newPassword});

        let data: Prisma.UserUpdateInput = {
            password: password 
        }

        const responseService = await this.user.UpdateUser(param.id, data);
        return responseService;
    }

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_USER);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.delete });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.DelteUser(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = this.global.GetObjectByCrudPermit(PERMIT_USER);
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction.recovery });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.RestoreUser(param.id);
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
