import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "../constant";
import { ListenerPayloadHistory } from "src/Validation/Listener/ListenerEvent";
import { HistoryEventListener } from "src/EventListener/HistoryEvent";
import { StaticticsForMonthEventListener } from "src/EventListener/StaticticsForMonthEvent";
import { StaticticsForYearEventListener } from "src/EventListener/StaticticsForYearEvent";
import { AbstractListenerEvent } from "src/Validation/Listener/AbstractListenerEvent";
import { StaticticsMonthModel } from "src/Model/S/StaticticsMonthModel";
import { GlobalService } from "./GlobalService";
import { StaticticsYearModel } from "src/Model/S/StaticticsYearModel";


@Injectable()
export class ListenerService {

    private date = new Date();

    constructor(
        private history: HistoryEventListener,
        private month: StaticticsMonthModel,
        private year: StaticticsYearModel,
    ) {}

    public async Distpatch({event,id,objectName,country,user}: AbstractListenerEvent) {
        this.history.register({ event,name:objectName,id });

        // MESUALES
        await this.month.Execute({ name:`application` });                   // aplicación
        await this.month.Execute({ name:`application.${objectName}` });     // global de interacción por objeto
        if(user) await this.month.Execute({ name:`user`,id:user });
        if(country) await this.month.Execute({ name:`country`,id:country });

        // ANUALES
        await this.year.Execute({ name:`application` });                   // aplicación
        await this.year.Execute({ name:`application.${objectName}` });     // global de interacción por objeto
        if(user) await this.year.Execute({ name:`user`,id:user });
        if(country) await this.year.Execute({ name:`country`,id:country });

    }
}
