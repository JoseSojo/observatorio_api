import { Injectable } from '@nestjs/common';
import CategoryModel from '../model/category.model';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { CategoryCreate } from '../guards/category.guard';
import { configCategory, Prisma } from '@prisma/client';
import { Filed, FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';
import { HistoryService } from 'src/history/history.service';
import { HistoryCreate } from 'src/history/guards/history.guard';

@Injectable()
export class ConfigCategoryService {

    private lang: LanguajeInterface

    constructor(
        private model: CategoryModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }

    /**
     * CREAR
     * 
     */
    public async create({ data }: { data: CategoryCreate }) {
        try {
            // Inicio
            const dataCreate: Prisma.configCategoryCreateInput = {
                name: data.name,
                ident: data.id,
                createByRef: { connect: { id: data.userId } }
            }
            const entity = await this.model.create({ data: dataCreate });

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
                body: {id:``}
            };
        }
    }

    /**
     * BUSCAR VARIOS PAGINADOS
     * @param param0 
     * @returns 
     */
    public async paginate({ filter, skip, take }: { filter: Prisma.configCategoryWhereInput, skip: number, take: number }) {
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
    public async find({ filter }: { filter: Prisma.configCategoryWhereInput }) {
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
    public async udpate({ id, data }: { id: string, data: Prisma.configCategoryUpdateInput }) {
        try {
            // Inicio

            const entityPromise = this.model.update({ filter: { id }, data })

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
    public async delte({ id }: { id: string }) {
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

    public async recovery({ id }: { id: string }) {
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
            `Identificador`,
            `Nombre`,
            `Creador`,
            `Creación`            
        ];
    }

    public getExtractList() {
        return [
            `ident`,
            `name`,
            `createByRef.email`,
            `createAt`,
        ];
    }

    public getDataUnique() {
        return [
            `Identificador`,
            `Nombre`,
            `Creador`,
            `Creación`
        ];
    }

    public getUniqueExtract() {
        return [
            `ident`,
            `name`,
            `createByRef.email`,
            `createAt`
        ];
    }

    /**
     * 
     * many     =>  lista de objeto
     * unique   =>  único objeto
     * project  =>  projectos en categorías
     */
    public getOptionsReportList() {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.CATEGORY.many,
                path: `/category/report/many/`,
                value: `many`,
            }
        ]
        return filed; 
    }

    public getOptionsReportUnique(id: string) {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.CATEGORY.unique,
                path: `/category/report/unique/${id}`,
                value: ``,
            }
        ]
        return filed; 
    }

    public getFormCreate() {
        const form: FORM = {
            method: `POST`,
            path: `/category/create`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.native.id`,
                    key: `from.create.native.id`,
                    label: this.lang.TITLES.INPUT.ID,
                    name: `id`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                },
                {
                    id: `from.create.native.name`,
                    key: `from.create.native.name`,
                    label: this.lang.TITLES.INPUT.NAME,
                    name: `name`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                }
            ]
        }
        return form;
    }

    public getFormUpdate(data: configCategory) {
        const form: FORM = {
            method: `PUT`,
            path: `/category/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.native.id`,
                    key: `from.create.native.id`,
                    label: this.lang.TITLES.INPUT.ID,
                    name: `id`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.ident
                },
                {
                    id: `from.create.native.name`,
                    key: `from.create.native.name`,
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
}
