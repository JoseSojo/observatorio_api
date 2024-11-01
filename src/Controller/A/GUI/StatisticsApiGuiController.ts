import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { query } from "express";
import { EventFactory } from "src/Factory/EventFactory";
import { PERMIT_STATICTICS_PIE } from "src/Fixtures/CurrentPermit";
import { AuthGuard } from "src/Guard/AuthGuard";
import { GlobalService } from "src/Service/GlobalService";
import { StaticticsService } from "src/Service/StaticticsService";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { BaseStatictics, GenerateStatisticsInterface, StaticticsPieName, TypeStatictics } from "src/Validation/Event";
import { TranslateType } from "src/Validation/Translate";

@Controller(`gui/statistics`)
export class StatisticsApiGuiController {

    private lang: TranslateType;

    constructor(
        private event: EventFactory,
        private global: GlobalService,
        private statictics: StaticticsService,
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate();
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async GetStaticticsFound(@Req() req: any,@Query() query: {object?:string,id?:string,pie?:string}) {
        const roles = req.user.rolReference.roles as string[];
        const events = this.global.GetEventsApp(roles);
        const pies = this.global.GetEventsPie(roles);
        
        let result: BaseStatictics[] = [];

        if(query.object) {
            result = [
                {
                    initType: "year",
                    listEvent: query.id ? [] : events,
                    event: query.id ? query.object : `application.${query.object}`,
                    initId: query.id ? query.id : `application`,
                    initYear: this.global.GetYear(),
                    listYear: [this.global.GetYear()]
                }, 
                {
                    initType: "month",
                    listEvent: query.id ? [] : events,
                    event: query.id ? query.object : `application.${query.object}`,
                    initId: query.id ? query.id : `application`,
                    listMonth: this.global.GetStructMonth(),
                    initMonth: this.global.GetMonth(),
                    initYear: this.global.GetYear(),
                    listYear: [this.global.GetYear()]
                }
            ]
        } else {
            result = [
                {
                    initType: "year",
                    listEvent: query.id ? null : events,
                    event: `application`,
                    initId: query.id ? query.id : `application`,
                    initYear: this.global.GetYear(),
                    listYear: [this.global.GetYear()]
                }, 
                {
                    initType: "month",
                    listEvent: query.id ? null : events,
                    event: `application`,
                    initId: query.id ? query.id : `application`,
                    listMonth: this.global.GetStructMonth(),
                    initMonth: this.global.GetMonth(),
                    initYear: this.global.GetYear(),
                    listYear: [this.global.GetYear()]
                }
            ]
        }

        return result;
    } 

    @Get(`/pie/:name`)
    public async GetStatisticsPie(@Param() param: {name:StaticticsPieName}, @Query() query: {}) {
        const {label,value,title} = await this.statictics.StaticticsPie({ name:param.name }); 
        return {label,value,title};
    }

    @Get(`/:type/`)
    @UseGuards(AuthGuard)
    public async GetStatisticsType(@Param() param: {type:TypeStatictics}, @Query() query: GenerateStatisticsInterface) {

        let label: any[] = [];
        let title: string = ``;
        let result: any = {};

        query.month = query.month ? Number(query.month) : this.global.GetMonth();
        query.year = query.year ? Number(query.year) : this.global.GetYear();
        query.id = query.id ? query.id : ``;

        if(param.type == `month`) {
            label = this.global.GetAllDays();
            title = `Estadísticas por mes.`;
            result = await this.statictics.GenerateStatisticsForMonth(query);
            
        } else {
            label = this.global.GetAllMonth();
            title = `Estadísticas por año.`;
            result = await this.statictics.GenerateStatisticsForYear(query );
        }

        return {title,label,result,type:param.type};
    }

}
