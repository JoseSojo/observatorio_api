import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { configNucleo, Prisma } from '@prisma/client';
import { FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';
import NucleoModel from '../model/nucleo.model';
import { NucleoCreate } from '../guards/nucleo.guard';

@Injectable()
export class ConfigNucleoService {

    private lang: LanguajeInterface

    constructor (
        private model: NucleoModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data,user }: { data:NucleoCreate, user?:string }) {
        try {
            // Inicio
            const dataCreate: Prisma.configNucleoCreateInput = {
                name: data.name,
                createByRef: { connect:{ id:data.userId } },
                parroquiaReference: { connect:{ id:data.parroquiaId}}
            }
            const entity = await this.model.create({data:dataCreate});

            // FIN
            return {
                message: this.lang.ACTIONS.SUCCESS.CREATE,
                error: false,
                body: entity
            };
        } catch (error) {
            console.log(error);
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
    public async paginate ({ filter, skip, take }: { filter:Prisma.configNucleoWhereInput, skip:number, take: number }) {
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
    public async find ({ filter }: { filter:Prisma.configNucleoWhereInput }) {
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
    public async udpate ({ id,data,user }: { id:string,data:NucleoCreate, user?:string }) {
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
            console.log(error);
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
            `Categoría`,
            `Creador`,
            `Creación`
        ];
    }

    public getExtractList() {
        return [
            `name`,
            `categoryRef.name`,
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
            path: `/program/create`,
            name: this.lang.TITLES.CREATE,
            fields: [
                
                
            ]
        }
        return form;
    }

    public getFormUpdate(data: configNucleo) {
        const form: FORM = {
            method: `PUT`,
            path: `/program/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: [
                
                // {
                //     id: `from.create.program.name`,
                //     key: `from.create.program.name`,
                //     label: this.lang.TITLES.INPUT.NAME,
                //     name: `name`,
                //     placeholder: ``,
                //     required: true,
                //     type: `text`,
                //     selectIn: `category`,
                // }
            ]
        }
        return form;
    }

    public getOptionsReportList() {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.PROGRAM.many,
                path: `/program/report/many/`,
                value: `many`,
            }
        ]
        return filed; 
    }

    public getOptionsReportUnique(id: string) {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.PROGRAM.unique,
                path: `/program/report/unique/${id}`,
                value: ``,
            }
        ]
        return filed; 
    }
}
