import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "../constant";
import { LanguajeService } from "./Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";


@Injectable()
export class GlobalService {

    private salt: number = 10;
    private date = new Date();

    private lang: TranslateType;

    constructor(
        private jwt: JwtService,
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate();
    }

    public GetEventsObject(): {label:string,objectName:string}[] {
        const eventsApp = [`country`,`state`,`city`,`coin`,`payment`,`subscription`,`permit`,`user`]
        
        const toArray: {label:string,objectName:string}[] = [];

        eventsApp.forEach((current) => {
            toArray.push({ label:this.lang.Event.app[current], objectName:current })
        });

        return toArray;
    }

    // eventos filtrados por los permisos de usuarios
    public GetEventsApp(roles:string[]): {label:string,objectName:string}[] {
        const toArray: {label:string,objectName:string}[] = [];

        if(roles.includes(`APP_STATICTICS_ALL_MONTH`) || roles.includes(`APP_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application`],objectName:`application` });
        if(roles.includes(`APP_USER_STATICTICS_ALL_MONTH`) || roles.includes(`APP_USER_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.user`],objectName:`application.user` });
        if(roles.includes(`APP_MASTER_COUNTRY_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_COUNTRY_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.country`],objectName:`application.country` });
        if(roles.includes(`APP_MASTER_STATE_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_STATE_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.state`],objectName:`application.state` });
        if(roles.includes(`APP_MASTER_CITY_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_CITY_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.city`],objectName:`application.city` });
        if(roles.includes(`APP_MASTER_COIN_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_COIN_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.coin`],objectName:`application.coin` });
        if(roles.includes(`APP_MASTER_PAYMENT_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_PAYMENT_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.payment`],objectName:`application.payment` });
        if(roles.includes(`APP_MASTER_SUBSCRIPTION_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_SUBSCRIPTION_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.subscription`],objectName:`application.subscription` });
        if(roles.includes(`APP_MASTER_PERMIT_STATICTICS_ALL_MONTH`) || roles.includes(`APP_MASTER_PERMIT_STATICTICS_ALL_YEAR`)) toArray.push({ label:this.lang.Event.app[`application.permit`],objectName:`application.permit` });
        
        return toArray;
    }

    public GetEventsPie(roles:string[]): {label:string,objectName:string}[] {
        const toArray: {label:string,objectName:string}[] = [];

        if(roles.includes(`APP_STATICTICS_ROLE_USER`)) toArray.push({ label:this.lang.Titles.Statictics.pie[`role.user`],objectName:`role.user` });
        if(roles.includes(`APP_STATICTICS_COIN_PAYMENT`)) toArray.push({ label:this.lang.Titles.Statictics.pie[`coin.payment`],objectName:`coin.payment` });
        if(roles.includes(`APP_STATICTICS_COUNTRY_STATE`)) toArray.push({ label:this.lang.Titles.Statictics.pie[`country.state`],objectName:`country.state` });
        if(roles.includes(`APP_STATICTICS_CITY_STATE`)) toArray.push({ label:this.lang.Titles.Statictics.pie[`city.state`],objectName:`city.state` });
        if(roles.includes(`APP_STATICTICS_SUBSCRIPTION_USER`)) toArray.push({ label:this.lang.Titles.Statictics.pie[`subscription.user`],objectName:`subscription.user` });
        
        return toArray;
    }

    public GetObjectByCrudPermit (crud: string[]) {
        return {
            create: crud[0],
            update: crud[1],
            unique: crud[2],
            delete: crud[3],
            list: crud[4],
            recovery: crud[5],
            count: crud[5],
        }
    }

    public async Hash({ password }: { password:string }) {
        return await bcrypt.hash(password, this.salt);
    }

    public async Compare({ password,dbPassword}: { password:string, dbPassword:string }) {
        return await bcrypt.compare(password, dbPassword);
    }

    public async GenerateToken({ id }: {id:string}) {
        return (await this.jwt.signAsync({id}, { secret:jwtConstants.secret })); 
    }

    public GetYear() {
        return this.date.getFullYear();
    }

    public GetMonth() {
        return this.date.getMonth()+1;
    }

    public GetDay() {
        return this.date.getDate();
    }

    public GetAllMonth() {
        return [
            `ENERO`,
            `FEBRERO`,
            `MARZO`,
            `ABRIL`,
            `MAYO`,
            `JUNIO`,
            `JULIO`,
            `AGOSTO`,
            `SEPTIEMBRE`,
            `OCTUBRE`,
            `NOVIEMBRE`,
            `DICIEMBRE`
        ]
    }

    public GetStructMonth(): {id:number,label:string}[] {
        return [
            {id:1,label:`ENERO`},
            {id:2,label:`FEBRERO`},
            {id:3,label:`MARZO`},
            {id:4,label:`ABRIL`},
            {id:5,label:`MAYO`},
            {id:6,label:`JUNIO`},
            {id:7,label:`JULIO`},
            {id:8,label:`AGOSTO`},
            {id:9,label:`SEPTIEMBRE`},
            {id:10,label:`OCTUBRE`},
            {id:11,label:`NOVIEMBRE`},
            {id:12,label:`DICIEMBRE`}
        ]
    }


    public GetAllDays() {
        return [
            `1`,
            `2`,
            `3`,
            `4`,
            `5`,
            `6`,
            `7`,
            `8`,
            `9`,
            `10`,
            `11`,
            `12`,
            `13`,
            `14`,
            `15`,
            `16`,
            `17`,
            `18`,
            `19`,
            `20`,
            `21`,
            `22`,
            `23`,
            `24`,
            `25`,
            `26`,
            `27`,
            `28`,
            `29`,
            `30`,
            `31`,
        ]
    }

}
