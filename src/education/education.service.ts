import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { Prisma, user } from '@prisma/client';
import EducationModel from './model/education.model';
import { CursoCreate, EducationCreate } from './guards/education.guard';

import { FORM } from 'src/validation/types/FromInterface';

@Injectable()
export class EducationService {

    private lang: LanguajeInterface

    constructor (
        private model: EducationModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }  
    
    /**
     * CREAR
     * 
     */
    public async create ({ data }: { data:EducationCreate }) {
        try {
            // Inicio
            const dataCreate: Prisma.educationProfileCreateInput = {
                area: data.area,
                countryId: data.countryId,
                institucion: data.institucion,
                nivel: data.nivel,
                profesion: data.profesion,
                subarea: data.subarea,
                yearEnd: data.yearEnd,
                userRef: { connect:{id:data.userId} }
            }
            const entity = await this.model.create({data:dataCreate});

            // estadistica
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
    public async paginate ({ filter, skip, take }: { filter:Prisma.educationProfileWhereInput, skip:number, take: number }) {
        try {
            // Inicio

            const listPromise = this.model.findAll({ skip, take, filter });
            const countPromise = this.model.count({ filter });

            const list = await listPromise;
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
     * CREAR
     * 
     */
    public async createCurso ({ data }: { data:CursoCreate }) {
        try {
            // Inicio
            const dataCreate: Prisma.cursosProfileCreateInput = {
                area: data.area,
                country: data.country,
                institucion: data.institucion,
                description: data.description,
                horas: data.horas,
                subarea: data.subarea,
                tipo: data.tipo,
                userRef: { connect:{id:data.userId} }
            }
            const entity = await this.model.createCurso({data:dataCreate});

            // estadistica
            // historial

            // FIN
            return {
                message: this.lang.ACTIONS.SUCCESS.CREATE,
                error: false,
                body: entity
            };
        } catch (error) {
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
    public async paginateCurso ({ filter, skip, take }: { filter:Prisma.cursosProfileWhereInput, skip:number, take: number }) {
        try {
            // Inicio

            const listPromise = this.model.findAllCurso({ skip, take, filter });
            const countPromise = this.model.countCursos({ filter });

            const list = await listPromise;
            const count = await countPromise;

            const next    = skip+take > count ? false : true;
            const previous = count <= take ? false : true;

            const test = skip+take;
            const now = `${test < count ? test : count}/${count}`;

            return {
                body: {
                    list, count, next, previous, now,
                    dataList: this.getExtractCursosList()
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
    public async find ({ filter }: { filter:Prisma.educationProfileWhereInput }) {
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

    public getDataList() {
        return [
            `Nivel`,
            `Profesión`,        
            `Área`,        
            `Subárea`,        
            `País`,        
        ];
    }

    public getExtractList() {
        return [
            `nivel`,
            `profesion`,
            `area`,
            `subarea`,
            `countryId`,
        ];
    }

    public getDataCursosList() {
        return [
            `Descripción`,
            `Tipo`,
            `Institución`,        
            `Área`,        
            `Subárea`,        
            `País`,        
        ];
    }

    public getExtractCursosList() {
        return [
            `description`,
            `tipo`,
            `institucion`,
            `area`,
            `subarea`,
            `country`,
        ];
    }

    public getDataUnique() {
        return [
            `Nombre`,
            `Apellido`,
            `Correo`,
            `Permiso`,
            `Creador`,
            `Creación`            
        ];
    }

    public getUniqueExtract() {
        return [
            `name`,
            `lastname`,
            `email`,
            `rolReference.name`,
            `createAt`,
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
