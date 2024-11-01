import { Injectable } from "@nestjs/common";
import { LanguajeService } from "./Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";

@Injectable()
export class ValidationService {

    private lang: TranslateType;

    constructor(
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate();
    } 

    public name(param: string) {
        const regexName = /^[a-zA-Z0-9]{2,}$$/;
        return regexName.test(param);
    }

    public lastname(param: string) {
        const regexName = /^[a-zA-Z]{2,}$/;
        return regexName.test(param);
    }

    public id(param: string) {
        const regexName = /^[a-zA-Z0-9\.\*\(\)-]{2,}$/;
        return regexName.test(param);
    }

    public number(param: number) {
        const regexName = /^[0-9]+$/;
        return regexName.test(param.toString());
    }

    public description(param: string) {
        const regexName = /^[a-zA-Z0-9\.\*\(\)]{10,}$/;
        return regexName.test(param);
    }

    public prefix(param: string) {
        return param ? true : false;
    }

}
