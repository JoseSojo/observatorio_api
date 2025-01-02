import { Controller, Get, Query, Req } from "@nestjs/common";
import { CardsService } from "src/cards/cards.service";
import CategoryModel from "src/config/model/category.model";
import ProgramModel from "src/config/model/program.model";
import { ConfigCategoryService } from "src/config/service/category.service";
import { ConfigLineService } from "src/config/service/line.service";
import { ConfigProgramService } from "src/config/service/program.service";
import { LanguajeInterface } from "src/languaje/guard/languaje.interface";
import { LanguajeService } from "src/languaje/languaje.service";
import AppPermit from "src/permit/module/app.permit";
import { PermitService } from "src/permit/permit.service";
import { PrismaService } from "src/prisma/prisma.service";
import ProjectModel from "src/project/model/project.model";
import ProjectService from "src/project/project.service";
import EstadoModel from "src/regional/model/estados.model";
import MunicipioModel from "src/regional/model/municipio.model";
import NucleoModel from "src/regional/model/nucleo.model";
import ParroquiaModel from "src/regional/model/parroquia.model";
import { ConfigEstadoService } from "src/regional/service/estados.service";
import { ConfigMunicipioService } from "src/regional/service/municipio.service";
import { ConfigNucleoService } from "src/regional/service/nucleo.service";
import { ConfigParroquiaService } from "src/regional/service/parroquia.service";
import { StorageService } from "src/storage/storage.service";
import UserModel from "src/user/model/user.model";
import { UserService } from "src/user/user.service";
import { Graphic } from "src/validation/types/DashboardInterface";

@Controller(`public/gui`)
export default class GuiPublicController {

    private lang: LanguajeInterface;

    constructor(
        private prisma: PrismaService,

        private permit: AppPermit,
        private languje: LanguajeService,

        private cards: CardsService,

        // modules
        private userService: UserService,
        private categoryService: ConfigCategoryService,
        private programService: ConfigProgramService,
        private lineService: ConfigLineService,
        private permitService: PermitService,
        private projectService: ProjectService,

        private stateService: ConfigEstadoService,
        private municipioService: ConfigMunicipioService,
        private parroquiaService: ConfigParroquiaService,
        private nucleoService: ConfigNucleoService,
        private estadoModel: EstadoModel,
        private municipioModel: MunicipioModel,
        private parroquiaModel: ParroquiaModel,
        private nucleoModel: NucleoModel,

        private storageService: StorageService,

        private userModel: UserModel,
        private projectModel: ProjectModel,
        private programModel: ProgramModel,
        private categoryModel: CategoryModel,


    ) {
        this.lang = this.languje.GetTranslate();
    }

    @Get(`card`)
    private async cardPublic () {
        const responseService = await this.cards.publicCards();

        return responseService;
    }

    @Get(`graphic`)
    private async graphic(@Req() req: any) {
        // const user = req.user as any;
        // const permits = user.rolReference.group as string[];

        const graphic: Graphic[] = [];

        const values: number[] = [];
        const header: string[] = [];

        const categoryList = await this.categoryModel.findAll({
            filter: {
                deleteAt: null
            },
            select: {
                id: true,
                ident: true,
                name: true,
                configProgram: {
                    select: {
                        name: true,
                        _count:{
                            select: {projects: true}
                        }
                    },
                    where: {
                        deleteAt: null
                    }
                }
            }
        })
        categoryList.forEach(category => {
            let val = 0;
            category.configProgram.forEach(program => {
                const custom = program as any;
                val += custom._count.projects
            });

            header.push(`${category.ident} ${category.name}`);
            values.push(val);
        });

        graphic.push({ label:header, value:values });

        console.log(graphic);

        return graphic
    }

}
