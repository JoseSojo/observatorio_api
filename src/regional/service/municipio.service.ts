import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { configMunicipio, Prisma } from '@prisma/client';
import { FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';
import MunicipioModel from '../model/municipio.model';
import { MunicipioCreate } from '../guards/municipio.guard';

@Injectable()
export class ConfigMunicipioService {

    private lang: LanguajeInterface

    constructor (
        private model: MunicipioModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data, user }: { data:MunicipioCreate, user?:string }) {
        try {
            // Inicio
            const dataCreate: Prisma.configMunicipioCreateInput = {
                name: data.name,
                stateReference: { connect: {id: data.estadoId} },
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
    public async paginate ({ filter, skip, take }: { filter:Prisma.configMunicipioWhereInput, skip:number, take: number }) {
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
    public async find ({ filter }: { filter:Prisma.configMunicipioWhereInput }) {
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
    public async udpate ({ id,data, user }: { id:string,data:MunicipioCreate,user?:string }) {
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
            console.log(error);
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
            `Creación`
        ];
    }

    public getExtractList() {
        return [
            `name`,
            `createByRef.email`,
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
                
            ]
        }
        return form;
    }

    public getFormUpdate(data: configMunicipio) {
        const form: FORM = {
            method: `PUT`,
            path: `/line/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: [
                
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
