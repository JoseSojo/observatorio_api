import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { Prisma, user } from '@prisma/client';
import UserModel from './model/user.model';
import { UserCreate } from './guards/user.guard';

import * as bcrypt from 'bcrypt';
import { FORM } from 'src/validation/types/FromInterface';
import { StaticticsService } from 'src/statictics/statictics.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    private lang: LanguajeInterface

    constructor (
        private model: UserModel,
        private prisma: PrismaService,
        private languajeService: LanguajeService,
        private statictics: StaticticsService,
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data }: { data:UserCreate }) {
        try {
            const date = new Date();
            const rol = await this.prisma.userGroup.findFirst({ where:{ id:data.rolId } });
            const staticticsPromise = this.statictics.currentStaticticsUser({ day:date.getDate(),month:date.getMonth()+1,year:date.getFullYear() });
            const staticticsRolPromise = this.statictics.currentStaticticsUser({ day:date.getDate(),month:date.getMonth()+1,year:date.getFullYear(), category:rol.name });
            const hastPassword = this.hashPassword({ password:data.password });

            // Inicio
            const dataCreate: Prisma.userCreateInput = {
                email: data.email,
                name: data.name.toLocaleUpperCase(),
                ci: data.ci,
                username: data.username.toLocaleUpperCase(),
                lastname: data.lastname.toLocaleUpperCase(),
                rolReference: { connect:{ id:data.rolId } },
                password: ``,
            }

            if(data.parentId) {
                dataCreate.parentReference = { connect:{ id:data.parentId } };
            }

            dataCreate.password = await hastPassword;
            const entity = await this.model.create({data:dataCreate});

            // estadistica
            await staticticsPromise;
            await staticticsRolPromise;

            // historial

            // FIN
            return {
                message: this.lang.ACTIONS.SUCCESS.CREATE,
                error: false,
                body: entity
            };
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.CREATE,
                error: true,
                errorMessage: error.message,
                body: null
            };
        }
    }

    /**
     * BUSCAR VARIOS PAGINADOS
     * @param param0 
     * @returns 
     */
    public async paginate ({ filter, skip, take }: { filter:Prisma.userWhereInput, skip:number, take: number }) {
        try {
            // Inicio

            const listPromise = this.model.findAll({ skip, take, filter });
            const countPromise = this.model.count({ filter });

            const list = (await listPromise).map((item) => {
                const date = new Date(item.createAt);
                return {
                    ...item,
                    createAt: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
                }
            });
            const count = await countPromise;



            const next    = skip+take > count ? false : true;
            const previous = count <= take ? false : true;

            const test = skip+take;
            const now = `${test < count ? test : count}/${count}`;

            return {
                body: {
                    list, count, next, previous, now,
                    dataList: this.getExtractList()
                },
                message: this.lang.ACTIONS.SUCCESS.LIST,
                error: false,
            }
            // Fin
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.LIST,
                error: true,
                errorMessage: error.message,
                body: null
            }
        }
    }

    /**
     * BUSCAR ÚNICO
     * @param param0 
     * @returns 
     */
    public async find ({ filter }: { filter:Prisma.userWhereInput }) {
        try {
            // Inicio

            const entity = await this.model.find({ filter });
            
            return {
                body: entity,
                message: this.lang.ACTIONS.SUCCESS.SHOW,
                error: false,
                header: this.getDataUnique(),
                dataList: this.getUniqueExtract(),
            }

            // Fin
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.SHOW,
                error: true,
                errorMessage: error.message,
                body: null
            }
        }
    }

    /**
     * ACTUALIZAR
     * @param param0 
     * @returns 
     */
    public async udpate ({ id,data }: { id:string,data:Prisma.userUpdateInput }) {
        try {
            // Inicio

            const entityPromise = this.model.update({ filter:{ id }, data })

            // estadística
            // historial

            const entity = await entityPromise;

            return {
                body: entity,
                message: this.lang.ACTIONS.SUCCESS.UPDATE,
                error: false
            }

            // Fin
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.UPDATE,
                error: true,
                errorMessage: error.message,
                body: null
            }
        }
    }

    /**
     * 
     * @param param0 
     * @returns 
     */
    public async delte ({ id }: { id:string }) {
        try {
            // Inicio

            const entityPromise = this.model.softDelete({ id });

            // estadistica
            // historial

            await entityPromise;

            return {
                body: null,
                message: this.lang.ACTIONS.SUCCESS.DELETE,
                error: false
            }

            // Fin
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.DELETE,
                error: true,
                errorMessage: error.message,
                body: null
            }
        }
    }

    /**
     * 
     * @param param0 
     * @returns 
     */
    public async recovery ({ id }: { id:string }) {
        try {
            // Inicio

            const entityPromise = this.model.recovery({ id });

            // estadistica
            // historial

            await entityPromise;

            return {
                body: null,
                message: this.lang.ACTIONS.SUCCESS.RECOVERY,
                error: false
            }

            // Fin
        } catch (error) {
            // log
            // log error
            return {
                message: this.lang.ACTIONS.DANGER.RECOVERY,
                error: true,
                errorMessage: error.message,
                body: null
            }
        }
    }    

    // HASH
    public async hashPassword ({ password }: { password: string }) {
        return bcrypt.hash(password, 11);
    }

    // COMPARE
    public async comparePassword ({ password, passwordDb }: { password: string,passwordDb: string }) {
        return await bcrypt.compare(password, passwordDb);
    }

    public getDataList() {
        return [
            `Nombre`,
            `Apellido`,
            `Correo`,
            `Permiso`,
            `Creación`,       
            `Cédula`            
        ];
    }

    public getExtractList() {
        return [
            `name`,
            `lastname`,
            `email`,
            `rolReference.name`,
            `createAt`,
            `ci`,
        ];
    }

    public getDataUnique() {
        return [
            `Nombre`,
            `Apellido`,
            `Correo`,
            `Permiso`,
            `Creador`,
            `Creación`,            
            `Cédula`            
        ];
    }

    public getUniqueExtract() {
        return [
            `name`,
            `lastname`,
            `email`,
            `rolReference.name`,
            `createAt`,
            `ci`,
        ];
    }

    public getFormRegister() {
        const form: FORM = {
            method: `POST`,
            path: `/user/create`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.user.permit`,
                    key: `from.create.user.permit`,
                    label: this.lang.TITLES.INPUT.PERMIT,
                    name: `rolId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    selectIn: `permit`,
                    select: true
                }, {
                    id: `from.create.user.name`,
                    key: `from.create.user.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }, {
                    id: `from.create.user.lastname`,
                    key: `from.create.user.lastname`,
                    label: this.lang.TITLES.INPUT.LASTNAME,
                    name: `lastname`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }, {
                    id: `from.create.user.email`,
                    key: `from.create.user.email`,
                    label: this.lang.TITLES.INPUT.EMAIL,
                    name: `email`,
                    placeholder: ``,
                    required: true,
                    type: `email`,
                }
            ]
        }
        return form;
    }

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/user/create`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.user.permit`,
                    key: `from.create.user.permit`,
                    label: this.lang.TITLES.INPUT.PERMIT,
                    name: `rolId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    selectIn: `permit`,
                    select: true
                }, {
                    id: `from.create.user.name`,
                    key: `from.create.user.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }, {
                    id: `from.create.user.lastname`,
                    key: `from.create.user.lastname`,
                    label: this.lang.TITLES.INPUT.LASTNAME,
                    name: `lastname`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }, {
                    id: `from.create.user.ci`,
                    key: `from.create.user.ci`,
                    label: this.lang.TITLES.INPUT.CI,
                    name: `ci`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }, {
                    id: `from.create.user.email`,
                    key: `from.create.user.email`,
                    label: this.lang.TITLES.INPUT.EMAIL,
                    name: `email`,
                    placeholder: ``,
                    required: true,
                    type: `email`,
                }, {
                    id: `from.create.user.password`,
                    key: `from.create.user.password`,
                    label: this.lang.TITLES.INPUT.PASSWORD,
                    name: `password`,
                    placeholder: ``,
                    required: true,
                    type: `password`,
                }, {
                    id: `from.create.user.username`,
                    key: `from.create.user.username`,
                    label: this.lang.TITLES.INPUT.USERNAME,
                    name: `username`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: user) {
        const form: FORM = {
            method: `PUT`,
            path: `/user/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.native.name`,
                    key: `from.create.native.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.name
                }, {
                    id: `from.create.native.lastname`,
                    key: `from.create.native.lastname`,
                    label: this.lang.TITLES.INPUT.LASTNAME,
                    name: `lastname`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.lastname
                }, {
                    id: `from.create.user.email`,
                    key: `from.create.user.email`,
                    label: this.lang.TITLES.INPUT.EMAIL,
                    name: `email`,
                    placeholder: ``,
                    required: true,
                    type: `email`,
                    value: data.email
                }, {
                    id: `from.create.user.password`,
                    key: `from.create.user.password`,
                    label: this.lang.TITLES.INPUT.PASSWORD,
                    name: `password`,
                    placeholder: ``,
                    required: true,
                    type: `password`,
                    value: `* * * * * * * * * *`
                }, {
                    id: `from.create.user.username`,
                    key: `from.create.user.username`,
                    label: this.lang.TITLES.INPUT.USERNAME,
                    name: `username`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.username
                },
            ]
        }
        return form;
    }
}
