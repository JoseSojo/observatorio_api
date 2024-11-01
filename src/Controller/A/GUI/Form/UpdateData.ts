import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ConfigCity } from "@prisma/client";
import { AuthGuard } from "src/Guard/AuthGuard";
import { CityService } from "src/Service/Master/CityService";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";
import { FORM, Select } from "src/Validation/UI/Form/GenericForm";

@Controller(`/gui/profile/form/update`)
export class UpdateDataApiController {

    private lang: TranslateType;

    constructor(
        private translate: LanguajeService,
    ) {
        this.lang = this.translate.GetTranslate();
    }

    @Get(``)
    @UseGuards(AuthGuard)
    public async update(@Req() req: any) {
        const user = req.user as any;

        const form:FORM = {
            fields: [
                {
                    key: `user.update.data.name`,
                    id: `name`,
                    label: this.lang.Input.name,
                    name: `name`,
                    placeholder: `name example`,
                    required: true,
                    type: `text`,
                    value: user.name ? user.name : ``,
                }, {
                    key: `user.update.data.lastname`,
                    id: `lastname`,
                    label: this.lang.Input.lastname,
                    name: `lastname`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: user.lastname ? user.lastname : ``,
                }, {
                    key: `user.update.data.username`,
                    id: `username`,
                    label: this.lang.Input.username,
                    name: `username`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: user.username ? user.username : ``,
                }, {
                    key: `user.update.data.email`,
                    id: `email`,
                    label: this.lang.Input.email,
                    name: `email`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: user.email ? user.email : ``,
                }, {
                    key: `user.update.data.city`,
                    id: `cityId`,
                    label: this.lang.Input.city,
                    name: `cityId`,
                    placeholder: ``,
                    required: true,
                    type: `text`,
                    value: user.city ? user.city : ``,
                    select: true,
                    selectIn: `city`
                }
            ],
            method: "PUT",
            name: this.lang.Titles.Form.profile.data,
            path: `/user/${user.id}/profile`
        }


        return form;
    }

}
