import { Injectable } from "@nestjs/common";
import { PermitsModel } from "src/Model/M/Permits/PermitsModel";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { GenerateStatisticsInterface } from "src/Validation/Event";
import { TranslateType } from "src/Validation/Translate";

@Injectable()
export class EventFactory {

    private lang: TranslateType;

    constructor(
        private permit: PermitsModel,
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate();
    }

}
