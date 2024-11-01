import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import {
    ActionsCrudType,
    ActionCrudInterface,
    ActionDeleteInterface,
    ActionListInterface,
    ActionCreateInterface,
    ActionUpdateInterface,
    ActionSearchInterface,
    CrudQueryParams,
    ObjectNameType,
    PathApiUrl,
} from "src/Validation/UI/CRUD/CrudApiInterface";
import {
    PERMIT_CITY,
    PERMIT_COIN,
    PERMIT_COUNTRY,
    PERMIT_PAYMENT_METHOD,
    PERMIT_PERMIT,
    PERMIT_STATE,
    PERMIT_USER,
    PERMIT_SUBSCRIPTION,
} from "src/Fixtures/CurrentPermit";
import { PermitsFactory } from "src/Factory/PermitsFactory";
import { AuthGuard } from "src/Guard/AuthGuard";
import { ConfigCountryService } from "src/Service/Master/CountryService";
import { StateService } from "src/Service/Master/StateService";
import { CityService } from "src/Service/Master/CityService";
import { CoinService } from "src/Service/Master/CoinService";
import { PaymentMethodService } from "src/Service/Master/PaymentMethodService";
import { SubscriptionService } from "src/Service/Master/SubscriptionService";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";
import { PermitService } from "src/Service/Master/PermitService";
import { UserService } from "src/Service/User/UserService";

@Controller(`/gui/crud`)
export class CrudApiController {

    private lang: TranslateType;

    constructor(
        private permitFactory: PermitsFactory,
        private countryService: ConfigCountryService,
        private stateService: StateService,
        private cityService: CityService,
        private coinService: CoinService,
        private paymentService: PaymentMethodService,
        private subscriptionService: SubscriptionService,
        private permitService: PermitService,
        private translate: LanguajeService,
        private user: UserService
    ) {
        this.lang = this.translate.GetTranslate();
    }

    @Get(`/:object`)
    @UseGuards(AuthGuard)
    public async generateCrud(@Query() query: CrudQueryParams, @Req() req: any, @Param() param: {object:string}) {
        const user = req.user;
        const roles = user.rolReference.roles as string[];
        let obj: string[] = [];

        if(!obj) return { objectName: this.lang.Action.NOT_FOUND }

        const { permitObject, objectService,title, header, label, maxHeader, maxLabel } = this.PermitObject(query.objectName);

        const roleObject = permitObject;
        const service = objectService

        const actions: ActionCrudInterface[] = [];
        const path = this.GeneratePath(query.objectName);

        // action create
        if(roles.includes(roleObject.create)) {
            actions.push({
                action: "create",
                create: {
                    label: this.lang.Titles.Form.create,
                    form: service.getFormCreate()
                }
            })
        }

        // action list
        if(roles.includes(roleObject.list)) {
            actions.push({
                action: "list",
                list: {
                    count: 0,
                    header: header,
                    label: label,
                    list: [],
                }
            })
        }

        // action find
        if(roles.includes(roleObject.unique)) {
            (roleObject.unique);
            actions.push({
                action: "show",
                show: {
                    header: maxHeader,
                    label: maxLabel
                }
            })
        }   

        return { actions, path, title }
    }

    private PermitObject(objName: ObjectNameType) {
        let obj: string[] = [];
        let service: any; 
        let title: string = ``;
        let header: string[] = []; 
        let maxHeader: string[] = []; 
        let label: any[] = []; 
        let maxLabel: any[] = []; 

        if(objName === "city") {
            title = this.lang.Titles.Crud.city;
            header = [`Nombre`,`Estado`,`Creador`,`Creación`,``];
            label = [`name`,`stateReference.name`,`createByReference.email`,`createAt`];
            maxHeader = [`Nombre`,`Estado`,`Creador`,`Creación`];
            maxLabel = [`name`,`stateReference.name`,`createByReference.email`,`createAt`];
            obj = PERMIT_CITY;
            service = this.cityService;
        }
        else if(objName === "coin") {
            title = this.lang.Titles.Crud.coin;
            header = [`Nombre`,`Prefijo`,`Creador`,`Métodos`,`Creación`,``];
            label = [`name`,`prefix`,`createByReference.email`,`_count.paymentMethods`,`createAt`];
            maxHeader = [`Nombre`,`Prefijo`,`Creador`,`Métodos`,`Creación`];
            maxLabel = [`name`,`prefix`,`createByReference.email`,`_count.paymentMethods`,`createAt`];
            obj = PERMIT_COIN;
            service = this.coinService;
        }
        else if(objName === "country") {
            title = this.lang.Titles.Crud.conuntry;
            header = [`Nombre`,`Moneda`,`Prefijo`,`Creador`,`Estados`,`Creación`,``];
            label = [`name`,`coinReference.name`,`prefixPhone`,`createByReference.email`,`_count.states`,`createAt`];
            maxHeader = [`Nombre`,`Moneda`,`Prefijo`,`Creador`,`Estados`,`Creación`];
            maxLabel = [`name`,`coinReference.name`,`prefixPhone`,`createByReference.email`,`_count.states`,`createAt`];
            obj = PERMIT_COUNTRY;
            service = this.countryService;
        }
        else if(objName === "payment") {
            title = this.lang.Titles.Crud.payment;
            header = [`Nombre`,`Moneda`,`Creador`,`Creación`,``];
            label = [`name`,`moneyReference.name`,`createByReference.email`,`createAt`,``];
            maxHeader = [`Nombre`,`Moneda`,`Creador`,`Creación`];
            maxLabel = [`name`,`moneyReference.name`,`createByReference.email`,`createAt`];
            obj = PERMIT_PAYMENT_METHOD;
            service = this.paymentService;
        }
        else if(objName === "permit") {
            title = this.lang.Titles.Crud.permit;
            obj = PERMIT_PERMIT;
            header = [`Nombre`,`Usuarios`,`Creador`,`Creación`,``];
            label = [`name`,`_count.users`,`createByReference.email`,`createAt`];
            maxHeader = [`Nombre`,`Usuarios`,`Creador`,`Creación`,`Permisos`];
            maxLabel = [`name`,`_count.users`,`createByReference.email`,`createAt`,`roles`];
            service = this.permitService;
        }
        else if(objName === "state") {
            title = this.lang.Titles.Crud.state;
            header = [`Nombre`,`País`,`Ciudades`,`Creador`,`Creación`,``];
            label = [`name`,`countryReference.name`,`_count.citys`,`createByReference.email`,`createAt`];
            maxHeader = [`Nombre`,`País`,`Ciudades`,`Creador`,`Creación`];
            maxLabel = [`name`,`countryReference.name`,`_count.citys`,`createByReference.email`,`createAt`];
            obj = PERMIT_STATE;
            service = this.stateService;
        }
        else if(objName === "subscription") {
            title = this.lang.Titles.Crud.subscription;
            header = [`Nombre`,`Detalles`,`usuarios`,`Creador`,`Creación`,``];
            label = [`name`,`_count.details`,``,`createByReference.email`,`createAt`];
            maxHeader = [`Nombre`,`Detalles`,`usuarios`,`Creador`,`Creación`];
            maxLabel = [`name`,`_count.details`,``,`createByReference.email`,`createAt`];
            obj = PERMIT_SUBSCRIPTION;
            service = this.subscriptionService;
        }
        else if(objName === "user") {
            title = this.lang.Titles.Crud.user;
            header = [`Nombre`,`Apellido`,`Correo`,`Permiso`,`Creación`,``];
            label = [`name`,`lastname`,`email`,`rolReference.name`,`createAt`]
            maxHeader = [`Nombre`,`Apellido`,`Correo`,`Permiso`,`Creación`];
            maxLabel = [`name`,`lastname`,`email`,`rolReference.name`,`createAt`]
            obj = PERMIT_USER;
            service = this.user;
        }

        const permitObject = this.permitFactory.PermitUniqueObject(obj);

        return { permitObject, objectService:service, title, header, label, maxHeader, maxLabel}
    }

    private GeneratePath(object: string, id?: string): PathApiUrl {
        return {
            create: `/${object}`,
            delete: (id: string) => `/${id}/${id}/delete`,
            find: (id: string) => `/${object}/${id}`,
            list: `/${object}`,
            update: (id: string) => `/${object}/${id}/update`
        }
    }
}
