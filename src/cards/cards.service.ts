import { Injectable } from '@nestjs/common';
import AppPermit from 'src/permit/module/app.permit';
import UserModel from 'src/user/model/user.model';

@Injectable()
export class CardsService {

    private permitFound: string;

    constructor(
        private user: UserModel,
        private appPermit: AppPermit
    ) {
        this.permitFound = this.appPermit.APP_PERMIT_ANALITIC_SECTION;
    }

    public async test () {}

}
