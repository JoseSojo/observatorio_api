import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { Prisma, projects } from '@prisma/client';

import ProjectModel from './model/project.model';
import { ProjectCreate } from './guards/project.model';
import { FORM } from 'src/validation/types/FromInterface';
import { ReportOption } from 'src/validation/types/ReportOptions';

@Injectable()
export default class ProjectService {

    private lang: LanguajeInterface

    constructor (
        private model: ProjectModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data }: { data:ProjectCreate }) {
        try {
            // Inicio

            // selecciona autores
            const authors: Prisma.authorCreateManyProjectsRefInput[] = [];
            data.userIdCurrent.forEach(id => {
                authors.push({ createById: id });
            })

            const dataCreate: Prisma.projectsCreateInput = {
                date: data.date,
                authos: {
                    createMany: { data:authors }
                },

                keywords: data.keywords,
                title: data.title,
                resumen: data.resumen,
                downloader: data.downloader ? true : false,
                public: data.public ? true : false,

                programRef: { connect:{ id:data.programId } },
                documentRef: { connect:{ id:data.documentId } }
            }

            console.log(dataCreate.public, data.public);
            console.log(dataCreate.downloader, data.downloader);

            if(data.lineId) {
                dataCreate.lineRef = { connect:{ id:data.lineId } };
            }
            const entity = await this.model.create({data:dataCreate});

            

            // // estadistica
            // // historial

            // // FIN
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
    public async paginate ({ filter, skip, take }: { filter:Prisma.projectsWhereInput, skip:number, take: number }) {
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
    public async find ({ filter }: { filter:Prisma.projectsWhereInput }) {
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
    public async udpate ({ id,data }: { id:string,data:Prisma.projectsUpdateInput }) {
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
            `Título`,
            `Autores`,
            `Programa`,
            `Categoría`,
            `Fecha`            
        ];
    }

    public getExtractList() {
        return [
            `title`,
            `_count.authos`,
            `programRef.name`,
            `programRef.categoryRef.name`,
            `date`            
        ];
    }

    public getDataUnique() {
        return [
            `Título`,
            `Resumen`,
            `Palabras Clave`,
            `¿Descargable?`,
            `¿Público?`,
            `Autores`,
            `Programa`,
            `Categoría`,
            `Fecha`            
        ];
    }

    public getUniqueExtract() {
        return [
            `title`,
            `resumen`,
            `keywords`,
            `downloader`,
            `public`,
            `_count.authos`,
            `programRef.name`,
            `programRef.categoryRef.name`,
            `date`            
        ];
    }

    public getFormUpdate(data: projects) {
        const form: FORM = {
            method: `PUT`,
            path: `/category/${data.id}/update`,
            name: this.lang.TITLES.CREATE,
            fields: [
                {
                    id: `from.create.native.title`,
                    key: `from.create.native.title`,
                    label: this.lang.TITLES.INPUT.ID,
                    name: `title`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.title
                }, {
                    id: `from.create.native.resumen`,
                    key: `from.create.native.resumen`,
                    label: this.lang.TITLES.INPUT.ID,
                    name: `resumen`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: data.resumen
                }, {
                    id: `from.create.native.date`,
                    key: `from.create.native.date`,
                    label: this.lang.TITLES.INPUT.ID,
                    name: `date`,
                    placeholder: ``,
                    required: true,
                    type: `date`,
                    value: data.date
                }, {
                    id: `from.create.native.date`,
                    key: `from.create.native.date`,
                    label: this.lang.TITLES.INPUT.ID,
                    name: `date`,
                    placeholder: ``,
                    required: true,
                    type: `date`,
                    value: data.date,
                    select: true,
                    selectIn: `category`
                },
                
            ]
        }
        return form;
    }

    public getOptionsReportList() {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.PROJECT.many,
                path: `/project/report/many/`,
                value: `many`,
            }
        ]
        return filed; 
    }

    public getOptionsReportUnique(id: string) {
        const filed: ReportOption[] = [
            {
                label: this.lang.REPORTS.PROJECT.unique,
                path: `/project/report/unique/${id}`,
                value: ``,
            }
        ]
        return filed; 
    }
}
