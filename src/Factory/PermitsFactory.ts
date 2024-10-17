
// validación (user) -> acción -> ejecución (response, saved)

import { Injectable } from "@nestjs/common";
import { PERMIT_CITY, PERMIT_COIN, PERMIT_COUNTRY, PERMIT_PAYMENT_METHOD, PERMIT_PERMIT, PERMIT_STATE, PERMIT_USER,PERMIT_SUBSCRIPTION,PERMIT_SUBSCRIPTION_DETAIL } from "src/Fixtures/CurrentPermit";
import { PermitsModel } from "src/Model/M/Permits/PermitsModel";


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
    ...PERMIT_SUBSCRIPTION_DETAIL
]

// admin 
export const currentAdmin = [
    ...PERMIT_STATE,
    ...PERMIT_CITY,
    ...PERMIT_COIN,
    ...PERMIT_PAYMENT_METHOD,
]

@Injectable()
export class PermitsFactory {

    constructor(
        private permit: PermitsModel
    ) {}

    public isAutorization({roles,rol}:{ roles:string[],rol:string}) {
        return roles.includes(rol) ? true : false;
    }

}
