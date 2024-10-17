import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StartFixtures } from 'src/Fixtures/StartFixtures';
import { CreateUserType } from 'src/Validation/User/CreateType';

@Controller()
export class DefaultController {

    constructor(
        private start: StartFixtures
    ) {}

    @Post(`/start/app`)
    public async startUser(@Body() body: CreateUserType, @Req() req: any) {
        const result = await this.start.run();
        return result;
    }
}
