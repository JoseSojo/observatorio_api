import { Injectable } from '@nestjs/common';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { Prisma } from '@prisma/client';
import HistoryModel from './model/history.model';
import { HistoryCreate } from './guards/history.guard';

@Injectable()
export class HistoryService {

    private lang: LanguajeInterface

    constructor (
        private model: HistoryModel,
        private languajeService: LanguajeService
    ) {
        this.lang = this.languajeService.GetTranslate();
    }    

    /**
     * CREAR
     * 
     */
    public async create ({ data }: { data:HistoryCreate }) {
        try {
            // Inicio
            const dataCreate: Prisma.historyCreateInput = {
                browser: data.browser,
                ip: data.ip,
                eventName: data.eventName,
                objectId: data.objectId,
                objectName: data.objectName,
                objectReference: data.objectReference,
                userId: data.userId,
            }
            const entity = this.model.create({data:dataCreate});

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
                body: []
            };
        }
    }

    /**
     * BUSCAR VARIOS PAGINADOS
     * @param param0 
     * @returns 
     */
    public async paginate ({ filter, skip, take }: { filter:Prisma.historyWhereInput, skip:number, take: number }) {
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
                    list, count, next, previous,now, 
                    header: this.getDataList(),
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
    public async find ({ filter }: { filter:Prisma.historyWhereInput }) {
        try {
            // Inicio

            const entity = await this.model.find({ filter });
            
            return {
                body: entity,
                message: this.lang.ACTIONS.SUCCESS.SHOW,
                error: false
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
    public async udpate ({ id,data }: { id:string,data:HistoryCreate }) {
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

    public getDataList() {
        return [
            `IP`,
            `Usuario`,
            `Última actualización`,
            `Creación`
        ];
    }

    public getExtractList() {
        return [
            `ip`,
            `userReference.email`,
            `eventName`,
            `createAt`
        ];
    }
}
