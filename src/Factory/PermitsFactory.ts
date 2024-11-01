
// validación (user) -> acción -> ejecución (response, saved)

import { Injectable } from "@nestjs/common";
import { 
    PERMIT_DEFAULT, 
    PERMIT_CITY, 
    PERMIT_COIN, 
    PERMIT_COUNTRY, 
    PERMIT_PAYMENT_METHOD, 
    PERMIT_PERMIT, 
    PERMIT_STATE, 
    PERMIT_USER,
    PERMIT_SUBSCRIPTION,
    PERMIT_SUBSCRIPTION_DETAIL,
    PERMIT_NOTIFICATION,
    PERMIT_STATICTICS_PIE
} from "src/Fixtures/CurrentPermit";
import { PermitsModel } from "src/Model/M/Permits/PermitsModel";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";
import { CheckItem } from "src/Validation/UI/Form/GenericForm";

type OBJECT_PERMIT = {create:string,update:string,unique:string,delete:string,list:string,recovery:string,month:string,year:String}

// superadmin
export const currentSuperAdmin = [
    ...PERMIT_USER,
    ...PERMIT_COUNTRY,
    ...PERMIT_STATE,
    ...PERMIT_CITY,
    ...PERMIT_COIN,
    ...PERMIT_PAYMENT_METHOD,
    ...PERMIT_PERMIT,
    ...PERMIT_SUBSCRIPTION,
    ...PERMIT_SUBSCRIPTION_DETAIL,
    ...PERMIT_DEFAULT,
    ...PERMIT_NOTIFICATION
]

@Injectable()
export class PermitsFactory {

    private lang: TranslateType;

    constructor(
        private permit: PermitsModel,
        private trans: LanguajeService
    ) {
        this.lang = this.trans.GetTranslate();
    }

    public PermitUniqueObject (item: string[]): OBJECT_PERMIT {
        const obj = {
            create:     item[0],
            update:     item[1],
            unique:     item[2],
            delete:     item[3],
            list:       item[4],
            recovery:   item[5],
            month:      item[6],
            year:       item[7],
        }
    
        return obj;
    }

    public getPermitCRUD(): CheckItem[]  {
        const moneyPermit = this.getPermitUniqueCrud(PERMIT_COIN, this.lang.Slide.coin); 
        const userPermit = this.getPermitUniqueCrud(PERMIT_USER, this.lang.Slide.user); 
        const paymentPermit = this.getPermitUniqueCrud(PERMIT_PAYMENT_METHOD, this.lang.Slide.payment); 
        const countryPermit = this.getPermitUniqueCrud(PERMIT_COUNTRY, this.lang.Slide.country); 
        const statePermit = this.getPermitUniqueCrud(PERMIT_STATE, this.lang.Slide.state); 
        const cityPermit = this.getPermitUniqueCrud(PERMIT_CITY, this.lang.Slide.city); 
        const permitPermit = this.getPermitUniqueCrud(PERMIT_PERMIT, this.lang.Slide.permit); 
        const subscriptionPermit = this.getPermitUniqueCrud(PERMIT_SUBSCRIPTION, this.lang.Slide.subscription); 
            
        return [
            ...userPermit,
            ...moneyPermit,
            ...paymentPermit,
            ...countryPermit,
            ...statePermit,
            ...cityPermit,
            ...permitPermit,
            ...subscriptionPermit,
        ];
    }

    // permisos abstractos
    public getAbstractPermitDefault() {
        const obj = PERMIT_DEFAULT; 
        return [
            { label:this.lang.Permit.profile.profile, value:`${obj[0]}` },
            { label:this.lang.Permit.profile.update, value:`${obj[1]}` },
            { label:this.lang.Permit.profile.password, value:`${obj[2]}` },
            { label:this.lang.Permit.profile.photo, value:`${obj[3]}` },
            { label:this.lang.Permit.profile.statictics_month, value:`${obj[4]}` },
            { label:this.lang.Permit.profile.statictics_year, value:`${obj[5]}` },
            { label:this.lang.Permit.statictics.month, value:`${obj[6]}` },
            { label:this.lang.Permit.statictics.year, value:`${obj[7]}` },
        ]
    }

    public getPermitStaticticsPie() {
        const obj = PERMIT_STATICTICS_PIE;
        return [
            { label:this.lang.Titles.Statictics.pie["role.user"], value:`${obj[0]}` },
            { label:this.lang.Titles.Statictics.pie["coin.payment"], value:`${obj[0]}` },
            { label:this.lang.Titles.Statictics.pie["country.state"], value:`${obj[0]}` },
            { label:this.lang.Titles.Statictics.pie["city.state"], value:`${obj[0]}` },
            { label:this.lang.Titles.Statictics.pie["subscription.user"], value:`${obj[0]}` },
        ];
    }

    // obtiene permiso y traducción
    public getPermitUniqueCrud(item: string[], name: string) {
        const object = this.PermitUniqueObject(item);
        const list: CheckItem[] = [];
    
        list.push({ label:`${this.lang.Permit.unique} ${name}`, value:`${object.unique}` });
        list.push({ label:`${this.lang.Permit.list} ${name}`, value:`${object.list}` });
        list.push({ label:`${this.lang.Permit.create} ${name}`, value:`${object.create}` });
        list.push({ label:`${this.lang.Permit.update} ${name}`, value:`${object.update}` });
        list.push({ label:`${this.lang.Permit.delete} ${name}`, value:`${object.delete}` });
        list.push({ label:`${this.lang.Permit.restore} ${name}`, value:`${object.recovery}` });
        list.push({ label:`${this.lang.Permit.statictics.month} ${name}`, value:`${object.month}` });
        list.push({ label:`${this.lang.Permit.statictics.year} ${name}`, value:`${object.year}` });
    
        return list;
    }

    public isAutorization({roles,rol}:{ roles:string[],rol:string}) {
        return roles.includes(rol) ? true : false;
    }
}
