import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ConfigCity, Permits } from "@prisma/client";
import { query } from "express";
import { AuthGuard } from "src/Guard/AuthGuard";
import { CityService } from "src/Service/Master/CityService";
import { CoinService } from "src/Service/Master/CoinService";
import { ConfigCountryService } from "src/Service/Master/CountryService";
import { PaymentMethodService } from "src/Service/Master/PaymentMethodService";
import { PermitService } from "src/Service/Master/PermitService";
import { StateService } from "src/Service/Master/StateService";
import { SubscriptionService } from "src/Service/Master/SubscriptionService";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { ReponseServiceDto } from "src/Validation/GlobalType";
import { TranslateType } from "src/Validation/Translate";
import { ObjectNameType } from "src/Validation/UI/CRUD/CrudApiInterface";
import { FORM, Select } from "src/Validation/UI/Form/GenericForm";

@Controller(`/gui/profile/form/select`)
export class SelectApiController {

    private lang: TranslateType;

    constructor(
        private translate: LanguajeService,
        private country: ConfigCountryService,
        private state: StateService,
        private city: CityService,
        private coin: CoinService,
        private payment: PaymentMethodService,
        private subscription: SubscriptionService,
        private permit: PermitService
    ) {
        this.lang = this.translate.GetTranslate();
    }

    @Get(`:object`)
    @UseGuards(AuthGuard)
    public async update(@Req() req: any, @Param() param: { object:ObjectNameType }, @Query() query: { param?:string }) {
        const user = req.user as any;
        const list = await this.GetObjectList({ object: param.object, param: query.param });

        return {list:list.body.list};
    }

    private async GetObjectList ({object, param}: {param?:string, object:ObjectNameType}): Promise<ReponseServiceDto | null> {
        const find = 10;

        if(object === "city") return this.city.FindAllConfigCity({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        else if(object === "coin") return this.coin.FindAllCoin({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        else if(object === "country") return this.country.FindAllConfigCountry({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        else if(object === "payment") return this.payment.FindAllPaymentMethod({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        else if(object === "permit") return this.permit.FindAllConfigPermit({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        else if(object === "state") return this.state.FindAllConfigState({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        else if(object === "subscription") return this.subscription.FindAllSubscription({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        // else if(object === "user") return this.user.FindA({ filter:[{ name:{contains:param} }], skip: 0, take:find });
        return null;
    }

}
