
// validación (user) -> acción -> ejecución (response, saved)

import { Injectable } from "@nestjs/common";
import { PermitsModel } from "src/Model/M/Permits/PermitsModel";
import { StaticticsMonthModel } from "src/Model/S/StaticticsMonthModel";
import { StaticticsYearModel } from "src/Model/S/StaticticsYearModel";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { BaseStaticticsPie, GenerateStatisticsInterface } from "src/Validation/Event";
import { TranslateType } from "src/Validation/Translate";
import { GlobalService } from "./GlobalService";
import { StaticticsModel } from "src/Model/S/StaticticsModel";

@Injectable()
export class StaticticsService {

    private lang: TranslateType;

    constructor(
        private permit: PermitsModel,
        private staticticsMonth: StaticticsMonthModel,
        private staticticsYear: StaticticsYearModel,
        private trans: LanguajeService,
        private global: GlobalService,
        private statictics: StaticticsModel
    ) {
        this.lang = this.trans.GetTranslate();
    }

    public async GenerateStatisticsForMonth({ event,id,month,year }: GenerateStatisticsInterface) {
        const result = await  this.staticticsMonth.GetStatictics({ event,id,month,year });
        if(!result) return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        return [
            result.totalDay1,
            result.totalDay2,
            result.totalDay3,
            result.totalDay4,
            result.totalDay5,
            result.totalDay6,
            result.totalDay7,
            result.totalDay8,
            result.totalDay9,
            result.totalDay10,
            result.totalDay11,
            result.totalDay12,
            result.totalDay13,
            result.totalDay14,
            result.totalDay15,
            result.totalDay16,
            result.totalDay17,
            result.totalDay18,
            result.totalDay19,
            result.totalDay20,
            result.totalDay21,
            result.totalDay22,
            result.totalDay23,
            result.totalDay24,
            result.totalDay25,
            result.totalDay26,
            result.totalDay27,
            result.totalDay28,
            result.totalDay29,
            result.totalDay30,
            result.totalDay31,
        ];
    }

    public async GenerateStatisticsForYear({ event,id,year }: GenerateStatisticsInterface) {
        const result = await  this.staticticsYear.GetStatictics({ event,id,year });
        if(!result) return [0,0,0,0,0,0,0,0,0,0,0,0]

        return [
            result.totalMonth1,
            result.totalMonth2,
            result.totalMonth3,
            result.totalMonth4,
            result.totalMonth5,
            result.totalMonth6,
            result.totalMonth7,
            result.totalMonth8,
            result.totalMonth9,
            result.totalMonth10,
            result.totalMonth11,
            result.totalMonth12
        ];
    }

    public async StaticticsPie({name}: BaseStaticticsPie) {
        console.log(name);
        if(name === "city_in_state") {
            const { label,value,title } = await this.statictics.PieCityInState();
            return { label, value,title };
        } else if(name === "coin_in_payment") {
            const { label,value,title } = await this.statictics.PieCoinInPayment();
            return { label, value,title };
        } else if(name === "state_in_country") {
            const { label,value,title } = await this.statictics.PieStateInCountry();
            return { label, value,title };
        } else if(name === "user_in_city") {
            const { label,value,title } = await this.statictics.PieUserInCity();
            return { label, value,title };
        } else if(name === "user_in_permit") {
            const { label,value,title } = await this.statictics.PieUserInPermit();
            return { label, value,title };
        } else if(name === "user_in_subscription") {
            const { label,value,title } = await this.statictics.PieUserInSubscription();
            return { label, value,title };
        }

        // const { label,value } = await this.statictics.PieRoleUser();
        return { label:[],value:[],title:`Gráfico` }

    }
    
}
