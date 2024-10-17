import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PermitsFactory } from 'src/Factory/PermitsFactory';
import { AuthGuard } from 'src/Guard/AuthGuard';
import { LanguajeService } from 'src/Service/Translate/LanguajeService';
import { UserService } from 'src/Service/User/UserService';
import { RequetsUser } from 'src/Validation/GlobalType';
import { TranslateType } from 'src/Validation/Translate';
import { CreateUserType, UpdateUserType } from 'src/Validation/User/CreateType';

@Controller('/user')
export class UserApiController {

    private lang: TranslateType;

    constructor(
        private user: UserService,
        private permitFactory: PermitsFactory,
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate()
    }

    @Get(`:id`)
    @UseGuards(AuthGuard)
    public async unique(@Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_USER_UNIQUE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindUser(param.id);
        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async paginate(@Param() param: { id: string }, @Req() req: any, @Query() query: { skip: string, take: string }) {
        const permitForAction = `APP_USER_LIST`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        //verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.FindAllUser({ filter: [], skip, take });
        return responseService;
    }

    @Post(`new`)
    @UseGuards(AuthGuard)
    public async create(@Body() body: CreateUserType, @Req() req: any) {
        const permitForAction = `APP_USER_CREATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
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
        const permitForAction = `APP_USER_UDPATE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
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

    @Put(`/:id/delete`)
    @UseGuards(AuthGuard)
    public async delete(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_USER_DELETE`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
        if (!permit) return { error: true, message: this.lang.Action.NOT_PERMIT }

        const responseService = await this.user.DelteUser(param.id);
        return responseService;
    }

    @Put(`/:id/recovery`)
    @UseGuards(AuthGuard)
    public async recovery(@Body() body: UpdateUserType, @Param() param: { id: string }, @Req() req: any) {
        const permitForAction = `APP_USER_RECOVERY`;
        const user = this.userFound(req);
        const roles = req.user.rolReference.roles

        // verify access
        const permit = this.permitFactory.isAutorization({ roles, rol: permitForAction });
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
