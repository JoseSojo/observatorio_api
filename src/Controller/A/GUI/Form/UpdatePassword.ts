import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/Guard/AuthGuard";
import { LanguajeService } from "src/Service/Translate/LanguajeService";
import { TranslateType } from "src/Validation/Translate";
import { FORM } from "src/Validation/UI/Form/GenericForm";

@Controller(`/gui/profile/form/password`)
export class PassowordDataApiController {

    private lang: TranslateType;

    constructor(
        private translate: LanguajeService
    ) {
        this.lang = this.translate.GetTranslate();
    }


    @Get(``)
    @UseGuards(AuthGuard)
    public async password(@Req() req: any) {

        const user = req.user as any;

        const form:FORM = {
            fields: [
                {
                    key: `user.password.data.now`,
                    id: `nowPassword`,
                    label: this.lang.Input.nowPassword,
                    name: `nowPassword`,
                    placeholder: ``,
                    required: true,
                    type: `password`,
                    value: ``,
                }, {
                    key: `user.password.data.new`,
                    id: `newPassword`,
                    label: this.lang.Input.newPassword,
                    name: `newPassword`,
                    placeholder: ``,
                    required: true,
                    type: `password`,
                    value: ``,
                }, {
                    key: `user.password.data.repeat`,
                    id: `repeatPassword`,
                    label: this.lang.Input.repeatPassword,
                    name: `repeatPassword`,
                    placeholder: ``,
                    required: true,
                    type: `password`,
                    value: ``,
                }
            ],
            method: "PUT",
            name: this.lang.Titles.Form.profile.password,
            path: `/user/${user.id}/profile/password`
        }

        return form;
    }



}
