import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/Guard/AuthGuard";
import { 
    PERMIT_CITY, 
    PERMIT_COIN, 
    PERMIT_COUNTRY, 
    PERMIT_PAYMENT_METHOD, 
    PERMIT_PERMIT, 
    PERMIT_STATE, 
    PERMIT_USER,
    PERMIT_SUBSCRIPTION,
    PERMIT_DEFAULT,
} from "src/Fixtures/CurrentPermit";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";
import { UserService } from "src/Service/User/UserService";
import { SubscriptionService } from "src/Service/Master/SubscriptionService";
import { ConfigCountryService } from "src/Service/Master/CountryService";

interface CustomAction {
    name:       string;
    path:       string;
    ico:        string;
    count?:     number;
}

interface GroupAction {
    name:       string;
    ico:        string;
    path:       string;
    count?:     number;
    child:      CustomAction[]
}

interface ActionNavbar {
    name:       string;
    ico:        string;
    path:       string;
    count?:     number;
}

interface CustomNavbar {
    name:       string;
    ico:        string;
    path:       string;
    count?:     number;
    child?:      ActionNavbar[]
}

type ListCustomAction = CustomAction | GroupAction


@Controller('/gui/admin')
export class DashboardApiGuiController {

    private lang: TranslateType;

    constructor(
        private translate: LanguajeService,
        private user: UserService,
        private subscription: SubscriptionService,
        private country: ConfigCountryService,

    ) {
        this.lang = this.translate.GetTranslate();
    }

    @Get(`dashboard`)
    @UseGuards(AuthGuard)
    public async dashboard(@Req() req: any) {
        const currentAction:ListCustomAction[] = []; // CONTRUCTOR SLIDE
        const currentCoutn:ListCustomAction[] = [];
        const currentNavbar:CustomNavbar[] = [];
 

        const roles = req.user.rolReference.roles as string[];
        const rolesList = roles.filter(item => item.includes(`LIST`));
        const rolesCount = roles.filter(item => item.includes(`COUNT`));

        const groupMaster:GroupAction = {
            child: [],
            ico: `master`,
            name: `Maestros`,
            path: ``
        } 

        // CARDS
        if(rolesCount.includes(PERMIT_USER[6])) {
            currentCoutn.push({ child:[], ico:`user`, name:this.lang.Slide.user, path:``,count:(await this.user.CountUser({filter:[]})) });
        }
        if(rolesCount.includes(PERMIT_COUNTRY[6])) {
            currentCoutn.push({ child:[], ico:`country`, name:this.lang.Slide.country, path:``, count:(await this.country.CountCountry({filter:[]})) });
        }
        if(rolesCount.includes(PERMIT_SUBSCRIPTION[6])) {
            currentCoutn.push({ child:[], ico:`subscription`, name:this.lang.Slide.subscription, path:``,count:(await this.subscription.CountSubscription({filter:[]})) });
        }

        // SLIDE
        
        if(rolesList.includes(PERMIT_COIN[4])) {
            if(PERMIT_COIN[4].includes(`MASTER`)) groupMaster.child.push({ ico:`coin`,name:this.lang.Slide.coin,path:`/admin/coin` });
            else currentAction.push({ ico:`coin`,name:this.lang.Slide.coin,path:`/admin/coin` });
        }
        if(rolesList.includes(PERMIT_PAYMENT_METHOD[4])) {
            if(PERMIT_PAYMENT_METHOD[4].includes(`MASTER`)) groupMaster.child.push({ ico:`payment`,name:this.lang.Slide.payment,path:`/admin/payment` });
            else currentAction.push({ ico:`payment`,name:this.lang.Slide.payment,path:`/admin/payment` });
        }
        if(rolesList.includes(PERMIT_PERMIT[4])) {
            currentAction.push({ ico:`permit`,name:this.lang.Slide.permit,path:`/admin/permit`});
        }
        if(rolesList.includes(PERMIT_SUBSCRIPTION[4])) {
            if(PERMIT_SUBSCRIPTION[4].includes(`MASTER`)) groupMaster.child.push({ ico:`subscription`,name:this.lang.Slide.subscription,path:`/admin/subscription` });
            else currentAction.push({ ico:`subscription`,name:this.lang.Slide.subscription,path:`/admin/subscription` });
        }
        if(rolesList.includes(PERMIT_COUNTRY[4])) {
            if(PERMIT_COUNTRY[4].includes(`MASTER`)) groupMaster.child.push({ ico:`country`,name:this.lang.Slide.country,path:`/admin/country` });
            else currentAction.push({ ico:`country`,name:this.lang.Slide.country,path:`/admin/country` });
        }
        if(rolesList.includes(PERMIT_STATE[4])) {
            if(PERMIT_STATE[4].includes(`MASTER`)) groupMaster.child.push({ ico:`state`,name:this.lang.Slide.state,path:`/admin/state` });
            else currentAction.push({ ico:`state`,name:this.lang.Slide.state,path:`/admin/state` });
        }
        if(rolesList.includes(PERMIT_CITY[4])) {
            if(PERMIT_CITY[4].includes(`MASTER`)) groupMaster.child.push({ ico:`city`,name:this.lang.Slide.city,path:`/admin/city` });
            else currentAction.push({ ico:`city`,name: this.lang.Slide.city,path:`/acity/city` });
        }
        if(rolesList.includes(PERMIT_USER[4])) {
            if(PERMIT_USER[4].includes(`MASTER`)) groupMaster.child.push({ ico:`user`,name:this.lang.Slide.user,path:`/admin/user` });
            else currentAction.push({ ico:`user`,name:this.lang.Slide.user,path:`/admin/user` });
        }

        // NAVBAR
        if(roles.includes(PERMIT_DEFAULT[0])) {
            currentNavbar.push({
                ico: `user.circle`,
                name: `profile`,
                path: `/admin/profile`,

            });
        }

        if(groupMaster.child.length > 0) currentAction.push(groupMaster);

        return {
            currentAction,
            currentCoutn,
            currentNavbar
        }
    }
}
