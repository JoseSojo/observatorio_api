import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/Guard/AuthGuard";
import { GlobalService } from "src/Service/GlobalService";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { BaseStatictics } from "src/Validation/Event";
import { TranslateType } from "src/Validation/Translate";

type ActionsTypeProfile = `show` | `update` | `password` | `photo`;

interface ActionsProfile {
    name: ActionsTypeProfile;
    path?: string;
    action: `page` | `modal`;
    ico:    string;
}

interface SectionActionsProfile {
    name: ActionsTypeProfile;
    body: any;
}

interface ProfilePageInterface {
    name: string;
    header: {
        photo: string | null;
        fullname: string;
        rol: string;
        actions: ActionsProfile[]
    },
    body?: SectionActionsProfile[]
}

@Controller('/gui/admin')
export class ProfileApiGuiController {

    private lang: TranslateType;

    constructor(
        private translate: LanguajeService,
        private global: GlobalService
    ) {
        this.lang = this.translate.GetTranslate();
    }

    @Get(`profile`)
    @UseGuards(AuthGuard)
    public async profile(@Req() req: any) {
        const user = req.user;
        const currentActions = [
            `APP_PROFILE_SHOW`, //0
            `APP_PROFILE_UPDATE_DATA`,//1
            `APP_PROFILE_UPDATE_PASSWORD`,//2
            `APP_PROFILE_UPDATE_PHOTO`,//3
            `APP_PROFILE_STATICTICS_FOR_MONTH`,//4
            `APP_PROFILE_STATICTICS_FOR_YEAR`//5
        ]
        const roles = user.rolReference.roles as string[];
        
        const statictics: BaseStatictics[] = []

        const profilePage: ProfilePageInterface = {
            name: `string`,
            header: {
                photo: null,
                fullname:`${user.name ? user.name : `____________`} ${user.lastname ? user.lastname : `____________`}`,
                rol: user.rolReference.name,
                actions: [],
            },
            body: []
        }

        const customActions: ActionsProfile[] = [];

        if(roles.includes(currentActions[0])) {
            customActions.push({ name:`show`, action:"modal", path:`/admin/profile/`, ico:`user.circle` });
            // body
        }

        if(roles.includes(currentActions[1])) {
            customActions.push({ name:`update`,action:"modal", path:`/admin/profile/update`, ico:`user.update` });
            // body
        }

        if(roles.includes(currentActions[2])) {
            customActions.push({ name:`password`,action:"modal", path:`/admin/profile/security`, ico:`user.security` });
            // body
        }

        // statictics
        if(!roles.includes(currentActions[4])) {
            statictics.push({ event:`user`,initId:user.id, initType:"month",initMonth:this.global.GetMonth(),initYear:this.global.GetYear(),listEvent:[],listMonth:this.global.GetStructMonth(),listYear:[this.global.GetYear()] });
        }

        if(!roles.includes(currentActions[5])) {
            statictics.push({ event:`user`,initId:user.id, initType:"year",initYear:this.global.GetYear(),listEvent:[],listYear:[this.global.GetYear()] })
        }

        // if(roles.includes(currentActions[3])) {
        //     customActions.push({ name:`photo`, path:``, ico:`user.photo` });
        //     // body
        // }

        profilePage.header.actions = customActions;

        return {
            page: {...profilePage, statictics}
        }
    }
}
