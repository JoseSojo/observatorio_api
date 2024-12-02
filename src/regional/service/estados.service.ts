import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { configState, Prisma } from '@prisma/client';
import { Filed, FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';
import EstadoModel from '../model/estados.model';
import { EstadoCreate } from '../guards/estado.guard';

@Injectable()
export class ConfigEstadoService {

    private lang: LanguajeInterface

    constructor(
        private model: EstadoModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }

    /**
     * CREAR
     * 
     */
    public async create({ data }: { data: EstadoCreate }) {
        try {
            // Inicio
            const dataCreate: Prisma.configStateCreateInput = {
                name: data.name,
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
    public async paginate({ filter, skip, take }: { filter: Prisma.configStateWhereInput, skip: number, take: number }) {
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
    public async find({ filter }: { filter: Prisma.configStateWhereInput }) {
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
    public async udpate({ id, data }: { id: string, data: Prisma.configStateUpdateInput }) {
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
            `Nombre`,
            "Cantidad de Estados",
            `Creador`,
            `Creación`            
        ];
    }

    public getExtractList() {
        return [
            `name`,
            `_count.municipios`,
            `createByRef.email`,
            `createAt`,
        ];
    }

    public getDataUnique() {
        return [
            `Nombre`,
            "Cantidad de Estados",
            `Creador`,
            `Creación`  
        ];
    }

    public getUniqueExtract() {
        return [
            `name`,
            `_count.municipios`,
            `createByRef.email`,
            `createAt`,
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
                path: `/category/many/`,
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
            fields: []
        }
        return form;
    }

    public getFormUpdate(data: configState) {
        const form: FORM = {
            method: `PUT`,
            path: `/category/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: []
        }
        return form;
    }
}
