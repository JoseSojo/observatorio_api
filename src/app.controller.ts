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

<<<<<<< HEAD
=======
    @Get(`start/project`)
    public async createProject () {
        const result = await this.fixtures.createProjectFixtures();
        return result;
    }

    @Get(`start/student`)
    public async createStudent () {
        const result = await this.fixtures.createStudent();
        return result;
    }

    @Get(`start/category`)
    public async startCategory () {
        const result = await this.fixtures.createCategoryProgramsLine();
        return result;
    }
    

>>>>>>> b0a1d26 (add remote brnach)
}
