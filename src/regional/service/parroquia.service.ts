import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { configParroquia, configProgram, Prisma } from '@prisma/client';
import { FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';
import ParroquiaModel from '../model/parroquia.model';
import { ParroquiaCreate } from '../guards/parroquia.guard';

@Injectable()
export class ConfigParroquiaService {

    private lang: LanguajeInterface

    constructor (
        private model: ParroquiaModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data,user }: { data:ParroquiaCreate, user?:string }) {
        try {
            // Inicio
            const dataCreate: Prisma.configParroquiaCreateInput = {
                name: data.name,
                createByRef: { connect:{ id:data.userId } },
                municipioReference: { connect:{ id:data.municipioId } }
            }
            const entity = await this.model.create({data:dataCreate});

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
                body: []
            };
        }
    }

    /**
     * BUSCAR VARIOS PAGINADOS
     * @param param0 
     * @returns 
     */
    public async paginate ({ filter, skip, take }: { filter:Prisma.configParroquiaWhereInput, skip:number, take: number }) {
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
     * BUSCAR ÚNICO
     * @param param0 
     * @returns 
     */
    public async find ({ filter }: { filter:Prisma.configParroquiaWhereInput }) {
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
    public async udpate ({ id,data,user }: { id:string,data:ParroquiaCreate, user?:string }) {
        try {
            // Inicio

            const entityPromise = this.model.update({ filter:{ id }, data:{name:data.name} });

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
    public async delte ({ id,user }: { id:string, user?:string}) {
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

    public async recovery ({ id,user }: { id:string, user?:string}) {
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
            `Nombre`,
            `Municipio`,
            `Creador`,
            `Creación`
        ];
    }

    public getExtractList() {
        return [
            `name`,
            `municipioReference.name`,
            `createByRef.email`,
            `createAt`
        ];
    }

    public getDataUnique() {
        return [
            `Nombre`,
            `Categoría`,
            `Creador`,
            `Creación`
        ];
    }

    public getUniqueExtract() {
        return [
            `name`,
            `categoryRef.name`,
            `createByRef.email`,
            `createAt`
        ];
    }

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/parroquia/create`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.Parroquia.name`,
                    key: `from.create.Parroquia.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                },
                {
                    id: `from.create.Parroquia.municipio`,
                    key: `from.create.Parroquia.municipio`,
                    label: this.lang.TITLES.INPUT.MUNICIPIO,
                    name: `municipioId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    selectIn: `municipio`,
                    select: true
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: configParroquia) {
        const form: FORM = {
            method: `PUT`,
            path: `/parroquia/${data.id}/update`,
            name: this.lang.TITLES.UPDATE,
            fields: [
                {
                    id: `from.create.Parroquia.name`,
                    key: `from.create.Parroquia.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.name
                }
            ]
        }
        return form;
    }

    public getOptionsReportList() {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.PARROQUIA.many,
                path: `/parroquia/report/many/`,
                value: `many`,
            }
        ]
        return filed; 
    }

    public getOptionsReportUnique(id: string) {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.PARROQUIA.unique,
                path: `/parroquia/report/unique/${id}`,
                value: ``,
            }
        ]
        return filed; 
    }
}
