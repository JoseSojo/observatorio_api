import { Controller, Get } from '@nestjs/common';
import TestFixture from './fixtures/test.fixture';

@Controller('app')
export class AppController {

    constructor(
        private fixtures: TestFixture
    ) {}

    @Get(`start`)
    public async start () {
        const result = await this.fixtures.start();
        return result;
    }

}
