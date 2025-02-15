import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { CategoryCreate } from '../guards/category.guard';
import { configInvestigationLine, Prisma } from '@prisma/client';
import { LineCreate } from '../guards/line.guard';
import LineModel from '../model/line.model';
import { FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';

@Injectable()
export class ConfigLineService {

    private lang: LanguajeInterface

    constructor (
        private model: LineModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data, user }: { data:LineCreate, user?:string }) {
        try {
            // Inicio
            const dataCreate: Prisma.configInvestigationLineCreateInput = {
                name: data.name,
                createByRef: { connect:{ id:data.userId } }
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
                body: {id:`string`}
            };
        }
    }

    /**
     * BUSCAR VARIOS PAGINADOS
     * @param param0 
     * @returns 
     */
    public async paginate ({ filter, skip, take }: { filter:Prisma.configInvestigationLineWhereInput, skip:number, take: number }) {
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
            });;
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
    public async find ({ filter }: { filter:Prisma.configInvestigationLineWhereInput }) {
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
    public async udpate ({ id,data, user }: { id:string,data:LineCreate,user?:string }) {
        try {
            // Inicio

            const entityPromise = this.model.update({ filter:{ id }, data:{ name:data.name } })

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
    public async delte ({ id, user}: { id:string,user?:string }) {
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

    public async recovery ({ id, user }: { id:string,user?:string }) {
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
            `Creador`,
            `Matriz`,
            `Creación`
        ];
    }

    public getExtractList() {
        return [
            `name`,
            `createByRef.email`,
            `parentReference.name`,
            `createAt`
        ];
    }

    public getDataUnique() {
        return [
            `Nombre`,
            `Creador`,
            `Creación`
        ];
    }

    public getUniqueExtract() {
        return [
            `name`,
            `createByRef.email`,
            `createAt`
        ];
    }

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/line/create`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.line.name`,
                    key: `from.create.line.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                },
                {
                    id: `from.create.line.lineParent`,
                    key: `from.create.line.lineParent`,
                    label: this.lang.TITLES.INPUT.MATRIZ,
                    name: `lineParent`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    select: true,
                    selectIn: `lineParent`
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: configInvestigationLine) {
        const form: FORM = {
            method: `PUT`,
            path: `/line/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.line.name`,
                    key: `from.create.line.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.name
                },
                {
                    id: `from.create.line.lineParent`,
                    key: `from.create.line.lineParent`,
                    label: this.lang.TITLES.INPUT.MATRIZ,
                    name: `lineParent`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.name,
                    select: true,
                    selectIn: `lineParent`
                }
            ]
        }
        return form;
    }

    public getOptionsReportList() {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.LINE.many,
                path: `/line/report/many/`,
                value: `many`,
            }
        ]
        return filed; 
    }

    public getOptionsReportUnique(id: string) {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.LINE.unique,
                path: `/line/report/unique/${id}`,
                value: ``,
            }
        ]
        return filed; 
    }
}
