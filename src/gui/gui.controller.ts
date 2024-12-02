import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { user } from '@prisma/client';
import CategoryModel from 'src/config/model/category.model';
import ConfigDocumentModel from 'src/config/model/document.model';
import ProgramModel from 'src/config/model/program.model';
import { ConfigCategoryService } from 'src/config/service/category.service';
import { ConfigLineService } from 'src/config/service/line.service';
import { ConfigProgramService } from 'src/config/service/program.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';
import { LanguajeService } from 'src/languaje/languaje.service';
import AppPermit from 'src/permit/module/app.permit';
import { PermitService } from 'src/permit/permit.service';
import { PrismaService } from 'src/prisma/prisma.service';
import ProjectModel from 'src/project/model/project.model';
import ProjectService from 'src/project/project.service';
import { StorageService } from 'src/storage/storage.service';
import UserModel from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';
import { ActionCrudInterface, ActionSlideInterface, ActionSlideInterfaceChilds, PermitObject } from 'src/validation/types/ActionSlideInterface';
import { Card, Graphic } from 'src/validation/types/DashboardInterface';
import { ModulesInterface } from 'src/validation/types/ModulesInterface';

@Controller('gui')
export class GuiController {

    private lang: LanguajeInterface;

    constructor(
        private prisma: PrismaService,

        private permit: AppPermit,
        private languje: LanguajeService,

        // modules
        private userService: UserService,
        private categoryService: ConfigCategoryService,
        private programService: ConfigProgramService,
        private lineService: ConfigLineService,
        private permitService: PermitService,
        private projectService: ProjectService,

        private storageService: StorageService,

        private userModel: UserModel,
        private projectModel: ProjectModel,
        private programModel: ProgramModel,
        private categoryModel: CategoryModel,


    ) {
        this.lang = this.languje.GetTranslate();
    }

    @Get(`card`)
    @UseGuards(AuthGuard)
    private async card(@Req() req: any) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const Cards: Card[] = [];

        // CARD ALMACENAMIENTO
        if (permits.includes(this.permit.APP_PERMIT_COUNT_STORAGE)) {
            Cards.push(await this.storageService.StorageCard());
        }

        // CARD USUARIOS
        if (permits.includes(this.permit.APP_PERMIT_COUNT_USER)) {
            const student = this.permit.ESTUDIANTE;
            const coor = this.permit.COODINADOR;
            const coordinadoresPromise = this.userModel.count({ filter: { AND: [{ deleteAt: null }, { rolReference: { name: coor } }] } });
            const estudaintesPromise = this.userModel.count({ filter: { AND: [{ deleteAt: null }, { rolReference: { name: student } }] } });
            const estCount = await estudaintesPromise;
            const coorCount = await coordinadoresPromise;

            const CHILD: { label: string, value: string }[] = []

            if (permits.includes(this.permit.APP_PERMIT_COUNT_COORDINADORES)) {
                CHILD.push({ label: `Coordinadores`, value: coorCount.toString() });
            }
            if (permits.includes(this.permit.APP_PERMIT_COUNT_ESTUDIANTES)) {
                CHILD.push({ label: `Estudiantes`, value: estCount.toString() });
            }

            if (permits.includes(this.permit.APP_PERMIT_COUNT_COORDINADORES) && permits.includes(this.permit.APP_PERMIT_COUNT_ESTUDIANTES)) {
                Cards.push({
                    ico: `student`,
                    label: `Usuarios`,
                    value: estCount + coorCount,
                    child: CHILD.length > 0 ? [
                        {
                            label: `Usuarios`,
                            value: (estCount + coorCount).toString()
                        },
                        ...CHILD
                    ] : undefined
                })
            } else if (permits.includes(this.permit.APP_PERMIT_COUNT_COORDINADORES)) {
                Cards.push({
                    ico: `student`,
                    label: `Coordinadores`,
                    value: coorCount,
                })
            } else if (permits.includes(this.permit.APP_PERMIT_COUNT_ESTUDIANTES)) {
                Cards.push({
                    ico: `student`,
                    label: `Estudiantes`,
                    value: estCount,
                })
            }
        }

        const CategoryCount = async (params: any[]) => {
            const CHILD: { label: string, value: string }[] = [];
            params.forEach(async (item) => {
                const found = await this.projectModel.count({ filter: { programRef: { categoryRef: { id: item.id } } } });
                CHILD.push({
                    label: item.name,
                    value: found.toString()
                });
            });

            return CHILD;
        }

        // CARD PROYECTOS
        if (permits.includes(this.permit.APP_PERMIT_COUNT_PROJECTS)) {
            const countByCategory = await this.categoryModel.findAll({ filter: { deleteAt: null }, select: { id: true, name: true }, skip: 0, take: 10 });
            const childPromise = CategoryCount(countByCategory);

            const countAllPromise = this.projectModel.count({ filter: { deleteAt: null } });
            const countAll = await countAllPromise;

            const child = await childPromise;

            Cards.push({
                ico: `project`,
                label: `Proyectos`,
                value: countAll,
                child: [
                    {
                        label: `Proyectos`,
                        value: countAll.toString()
                    },
                    ...child
                ]
            });
        }

        return Cards
    }

    @Get(`statistics`)
    @UseGuards(AuthGuard)
    private async statictics(@Req() req: any) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];



        return {}
    }

    @Get(`graphic`)
    @UseGuards(AuthGuard)
    private async graphic(@Req() req: any) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const graphic: Graphic[] = [];

        if (permits.includes(this.permit.APP_PERMIT_STATICTIS_PROJECTS_IN_CATEGORY)) {
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
        }
        if (permits.includes(this.permit.APP_PERMIT_STATICTIS_PROJECTS_IN_PROGRAM)) {
            const values: number[] = [];
            const header: string[] = [];

            const result = await this.prisma.configProgram.findMany({
                skip: 0,
                take: 10,
                select: {
                    name: true,
                    _count: {
                        select: {
                            projects: true,
                        }
                    }
                },
                orderBy: {
                    projects: {_count:'desc'}
                }
            });
            result.forEach((program) => {
                header.push(program.name);
                values.push(program._count.projects);
            });
            graphic.push({ label:header,value:values });
        }
        if (permits.includes(this.permit.APP_PERMIT_STATICTIS_PROJECTS_IN_LINE)) {
            const values: number[] = [];
            const header: string[] = [];

            const result = await this.prisma.configInvestigationLine.findMany({
                skip: 0,
                take: 10,
                select: {
                    name: true,
                    _count: {
                        select: {
                            projects: true,
                        }
                    }
                },
                orderBy: {
                    projects: {_count:'desc'}
                }
            });
            result.forEach((program) => {
                header.push(program.name);
                values.push(program._count.projects);
            });
            graphic.push({ label:header,value:values });
        }
        // if (permits.includes(this.permit.APP_PERMIT_STATICTIS_PROJECTS_IN_HISTORY)) {

        // }

        return graphic
    }

    @Get(`slide`)
    @UseGuards(AuthGuard)
    private slide(@Req() req: any) {

        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const actions: ActionSlideInterface[] = [];

        const reports: ActionSlideInterface[] = [];
        const config: ActionSlideInterface[] = [];
        const analisis: ActionSlideInterface[] = [];

        // PANEL
        actions.push({
            ico: `dashboard`,
            path: `/dashboard`,
            label: this.lang.TITLES.SLIDE.DASHBOARD
        })

        // HISTORY


        // CONFIG
        if (permits.includes(this.permit.APP_PERMIT_CONFIG_CATEGORY_LIST)) {
            config.push({ ico: `category`, label: this.lang.TITLES.SLIDE.CONFIG.CATEGORY, path: `/dashboard/category` });
        }
        if (permits.includes(this.permit.APP_PERMIT_CONFIG_PROGRAM_LIST)) {
            config.push({ ico: `program`, label: this.lang.TITLES.SLIDE.CONFIG.PROGRAM, path: `/dashboard/program` });
        }
        if (permits.includes(this.permit.APP_PERMIT_CONFIG_LINE_LIST)) {
            config.push({ ico: `line`, label: this.lang.TITLES.SLIDE.CONFIG.LINE, path: `/dashboard/line` });
        }

        if (permits.includes(this.permit.APP_PERMIT_CONFIG_STATE_LIST)) {
            analisis.push({ ico: `state`, label: this.lang.TITLES.SLIDE.REGIONAL.STATE, path: `/dashboard/state` });
        }
        if (permits.includes(this.permit.APP_PERMIT_CONFIG_MUNICIPIO_LIST)) {
            analisis.push({ ico: `municipio`, label: this.lang.TITLES.SLIDE.REGIONAL.MUNICIPIO, path: `/dashboard/municipio` });
        }
        if (permits.includes(this.permit.APP_PERMIT_CONFIG_PARRAOQUIAS_LIST)) {
            analisis.push({ ico: `parroquia`, label: this.lang.TITLES.SLIDE.REGIONAL.PARROQUIA, path: `/dashboard/parroquia` });
        }
        if (permits.includes(this.permit.APP_PERMIT_CONFIG_NUCLEOS_LIST)) {
            analisis.push({ ico: `nucleo`, label: this.lang.TITLES.SLIDE.REGIONAL.NUCLEO, path: `/dashboard/nucleo` });
        }

        // USER
        if (permits.includes(this.permit.APP_PERMIT_USER_LIST)) {
            actions.push({ ico: `user`, label: this.lang.TITLES.SLIDE.USERS, path: `/dashboard/user` });
        }

        // PERMISOS
        if (permits.includes(this.permit.APP_PERMIT_PERMIT_LIST)) {
            actions.push({ ico: `permit`, label: this.lang.TITLES.SLIDE.PERMIT, path: `/dashboard/permit` });
        }

        // TRABAJOS
        if (permits.includes(this.permit.APP_PERMIT_PROJECT_LIST)) {
            actions.push({ ico: `project`, label: this.lang.TITLES.SLIDE.PROJECTS, path: `/project` });
        }

        // REPORT SECTION
        // TRABAJOS
        if (permits.includes(this.permit.APP_PERMIT_PROJECT_REPORT)) {
            actions.push({ ico: `report`, label: this.lang.TITLES.SLIDE.REPORT, path: `/report` });
        }

        const actionsSend: (ActionSlideInterfaceChilds | ActionSlideInterface)[] = [];

        if (actions.length > 0) actionsSend.push(...actions);
        if (config.length > 0) {
            actionsSend.push({
                childs: config,
                ico: `config`,
                label: this.lang.TITLES.SLIDE.CONFIG.INDEX,
                path: `/config`
            })
        };
        if (config.length > 0) {
            actionsSend.push({
                childs: analisis,
                ico: `config`,
                label: this.lang.TITLES.SLIDE.REGIONAL.INDEX,
                path: `/regional`
            })
        };
        // if(actions.length > 0) actionsSend.push(...actions);

        return {
            body: actionsSend,
            message: ``,
            error: false
        }
    }

    @Get(`:crud`)
    @UseGuards(AuthGuard)
    private crud(@Req() req: any, @Param() param: { crud: ModulesInterface }) {

        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let header: string[] = [];
        let title: string = ``;
        let actions: ActionCrudInterface[] = [];
        let actionsUnique: ActionCrudInterface[] = [];

        if (param.crud == `category`) {
            header = this.categoryService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.CATEGORY;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `program`) {
            header = this.programService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.PROGRAM;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `line`) {
            header = this.lineService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.LINE;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `user`) {
            header = this.userService.getDataList();
            title = this.lang.TITLES.SLIDE.USERS;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `project`) {
            header = this.projectService.getDataList();
            title = this.lang.TITLES.SLIDE.PROJECTS;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
            actions.push({ ico: `create`, label: this.lang.TITLES.CREATE, path: `/dashboard/${param.crud}/create`, use: 'page' })
        } else if (param.crud == `permit`) {
            header = this.permitService.getDataList();
            title = this.lang.TITLES.SLIDE.PERMIT;
            // actions = this.getActionsList(permits, currentPermit, param.crud);
            // actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        }

        return {
            header,
            title,
            actions,
            actionsUnique
        }
    }

    @Get(`/create/:crud`)
    @UseGuards(AuthGuard)
    private create(@Req() req: any, @Param() param: { crud: ModulesInterface }) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let header: string[] = [];
        let title: string = ``;
        let actions: ActionCrudInterface[] = [];
        let actionsUnique: ActionCrudInterface[] = [];
        let form = null;

        if (param.crud == `category`) {
            header = this.categoryService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.CATEGORY;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.categoryService.getFormCreate();
        } else if (param.crud == `program`) {
            header = this.programService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.PROGRAM;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.programService.getFormCreate();
        } else if (param.crud == `line`) {
            header = this.lineService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.LINE;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.lineService.getFormCreate();
        } else if (param.crud == `user`) {
            header = this.userService.getDataList();
            title = this.lang.TITLES.SLIDE.USERS;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.userService.getFormCreate();
        } else if (param.crud == `project`) {
            header = this.projectService.getDataList();
            title = this.lang.TITLES.SLIDE.PROJECTS;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            // form = this.projectService.getFormCreate();
        }

        return {
            header,
            title,
            actions,
            actionsUnique,
            form
        }
    }

    @Get(`/update/:crud/:id`)
    @UseGuards(AuthGuard)
    private async update(@Req() req: any, @Param() param: { crud: ModulesInterface, id: string }) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let header: string[] = [];
        let title: string = ``;
        let actions: ActionCrudInterface[] = [];
        let actionsUnique: ActionCrudInterface[] = [];
        let form = null;
        let item = null;

        if (param.crud == `category`) {
            const currentItem = await this.categoryService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.categoryService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.CATEGORY;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.categoryService.getFormUpdate(item);
        } else if (param.crud == `program`) {
            const currentItem = await this.programService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.programService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.PROGRAM;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.programService.getFormUpdate(item);
        } else if (param.crud == `line`) {
            const currentItem = await this.lineService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.lineService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.CATEGORY;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.lineService.getFormUpdate(item);
        } else if (param.crud == `user`) {
            const currentItem = await this.userService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.userService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.CATEGORY;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.userService.getFormUpdate(item);
        } else if (param.crud == `project`) {
            const currentItem = await this.projectService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.projectService.getDataList();
            title = this.lang.TITLES.SLIDE.PROJECTS;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.projectService.getFormUpdate(item);
        }

        return {
            header,
            title,
            actions,
            actionsUnique,
            form,
            item
        }
    }

    @Get(`/delete/:crud/:id`)
    @UseGuards(AuthGuard)
    private async delete(@Req() req: any, @Param() param: { crud: ModulesInterface, id: string }) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let header: string[] = [];
        let title: string = ``;
        let actions: ActionCrudInterface[] = [];
        let actionsUnique: ActionCrudInterface[] = [];
        let form = null;
        let item = null;

        if (param.crud == `category`) {
            const currentItem = await this.categoryService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.categoryService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.CATEGORY;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.categoryService.getFormUpdate(item);
        } else if (param.crud == `program`) {
            const currentItem = await this.programService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.programService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.PROGRAM;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.programService.getFormUpdate(item);
        } else if (param.crud == `line`) {
            const currentItem = await this.lineService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.lineService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.LINE;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.lineService.getFormUpdate(item);
        } else if (param.crud == `user`) {
            const currentItem = await this.userService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.userService.getDataList();
            title = this.lang.TITLES.SLIDE.CONFIG.LINE;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            form = this.userService.getFormUpdate(item);
        } else if (param.crud == `project`) {
            const currentItem = await this.projectService.find({ filter: { id: param.id } });
            item = currentItem.body
            header = this.projectService.getDataList();
            title = this.lang.TITLES.SLIDE.PROJECTS;
            actions = this.getActionsList(permits, currentPermit, param.crud);
            // form = this.projectService.getFormUpdate(item);
        }

        return {
            header,
            title,
            actions,
            actionsUnique,
            form,
            item
        }
    }

    @Get(`/report/:crud/`)
    @UseGuards(AuthGuard)
    private async report(@Req() req: any, @Param() param: { crud: ModulesInterface }) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let dataList: string[] = []
        let item: any = null;
        let report: any[] = [];
        let title: string = ``;

        if (param.crud == `category`) {
            // const currentItem = await this.categoryService.find({ filter:{id:param.id} });
            // item = currentItem.body;

            dataList = this.categoryService.getUniqueExtract();
            // title = item.name;
            report = this.categoryService.getOptionsReportList();
        } else if (param.crud === `program`) {
            // const currentItem = await this.programService.find({ filter:{id:param.id} });
            // item = currentItem.body;

            dataList = this.programService.getUniqueExtract();
            // title = item.name;
            report = this.programService.getOptionsReportList();
        } else if (param.crud === `line`) {
            // const currentItem = await this.lineService.find({ filter:{id:param.id} });
            // item = currentItem.body;

            dataList = this.lineService.getUniqueExtract();
            // title = item.name;
            report = this.lineService.getOptionsReportList();
        } else if (param.crud === `project`) {
            // const currentItem = await this.lineService.find({ filter:{id:param.id} });
            // item = currentItem.body;

            dataList = this.projectService.getUniqueExtract();
            // title = item.name;
            report = this.projectService.getOptionsReportList();
        }


        return {
            report,
            title,
            body: item,
            dataList
        }
    }

    @Get(`/report/:crud/:id`)
    @UseGuards(AuthGuard)
    private async reportUnique(@Req() req: any, @Param() param: { crud: ModulesInterface, id: string }) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let dataList: string[] = []
        let item: any = null;
        let report: any[] = [];
        let title: string = ``;

        if (param.crud == `category`) {
            const currentItem = await this.categoryService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.categoryService.getUniqueExtract();
            title = item.name;
            report = this.categoryService.getOptionsReportUnique(param.id);
        } else if (param.crud === `program`) {
            const currentItem = await this.programService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.programService.getUniqueExtract();
            title = item.name;
            report = this.programService.getOptionsReportUnique(param.id);
        } else if (param.crud === `line`) {
            const currentItem = await this.lineService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.lineService.getUniqueExtract();
            title = item.name;
            report = this.lineService.getOptionsReportUnique(param.id);
        } else if (param.crud === `project`) {
            const currentItem = await this.projectService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.projectService.getUniqueExtract();
            title = item.name;
            report = this.projectService.getOptionsReportUnique(param.id);
        }


        return {
            report,
            title,
            body: item,
            dataList
        }
    }

    @Get(`:crud/:id`)
    @UseGuards(AuthGuard)
    private async crudId(@Req() req: any, @Param() param: { crud: ModulesInterface, id: string }) {
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        const currentPermit = this.getPermit(param.crud);

        let dataList: string[] = []
        let item: any = null;
        let header: string[] = [];
        let title: string = ``;
        let actions: ActionCrudInterface[] = [];
        let actionsUnique: ActionCrudInterface[] = [];

        if (param.crud == `category`) {
            const currentItem = await this.categoryService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.categoryService.getUniqueExtract();
            header = this.categoryService.getDataUnique();
            title = item.name;
            actions = this.getActionsUniquePage(permits, currentPermit, param.crud, param.id);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `program`) {
            const currentItem = await this.programService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.programService.getUniqueExtract();
            header = this.programService.getDataUnique();
            title = item.name;
            actions = this.getActionsUniquePage(permits, currentPermit, param.crud, param.id);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `line`) {
            const currentItem = await this.lineService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.lineService.getUniqueExtract();
            header = this.lineService.getDataUnique();
            title = item.name;
            actions = this.getActionsUniquePage(permits, currentPermit, param.crud, param.id);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `user`) {
            const currentItem = await this.userService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.userService.getUniqueExtract();
            header = this.userService.getDataUnique();
            title = item.name;
            actions = this.getActionsUniquePage(permits, currentPermit, param.crud, param.id);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `project`) {
            const currentItem = await this.projectService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.projectService.getUniqueExtract();
            header = this.projectService.getDataUnique();
            title = item.title;
            actions = this.getActionsUniquePage(permits, currentPermit, param.crud, param.id);
            actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        } else if (param.crud == `permit`) {
            const currentItem = await this.permitService.find({ filter: { id: param.id } });
            item = currentItem.body;

            dataList = this.permitService.getUniqueExtract();
            header = this.permitService.getDataUnique();
            title = item.title;
            // actions = this.getActionsUniquePage(permits, currentPermit, param.crud, param.id);
            // actionsUnique = this.getActionsUnique(permits, currentPermit, param.crud);
        }

        return {
            header,
            title,
            actions,
            actionsUnique,
            body: item,
            dataList
        }
    }

    private getActionsList(permit: string[], actions: PermitObject, crud: string): ActionCrudInterface[] {
        const actionsResponse: ActionCrudInterface[] = []

        if (permit.includes(actions.list)) actionsResponse.push({ ico: `list`, label: this.lang.TITLES.LIST, path: `/dashboard/${crud}/`, use: 'page' });
        if (permit.includes(actions.create)) actionsResponse.push({ ico: `create`, label: this.lang.TITLES.CREATE, path: `/dashboard/${crud}/`, use: 'modal' });
        if (permit.includes(actions.report)) actionsResponse.push({ ico: `report`, label: this.lang.TITLES.REPORT, path: `/dashboard/${crud}/`, use: 'download' });

        return actionsResponse
    }

    private getActionsUnique(permit: string[], actions: PermitObject, crud: string): ActionCrudInterface[] {
        const actionsResponse: ActionCrudInterface[] = []

        if (permit.includes(actions.unique)) actionsResponse.push({ ico: `unique`, label: this.lang.TITLES.UNIQUE, path: `/dashboard/${crud}/`, use: 'page' });
        if (permit.includes(actions.delete)) actionsResponse.push({ ico: `delete`, label: this.lang.TITLES.DELETE, path: `/dashboard/${crud}/`, use: 'modal' });
        if (permit.includes(actions.update)) actionsResponse.push({ ico: `update`, label: this.lang.TITLES.UPDATE, path: `/dashboard/${crud}/`, use: 'modal' });

        return actionsResponse
    }

    private getActionsUniquePage(permit: string[], actions: PermitObject, crud: string, id: string): ActionCrudInterface[] {
        const actionsResponse: ActionCrudInterface[] = []

        if (permit.includes(actions.unique)) actionsResponse.push({ ico: `list`, label: this.lang.TITLES.LIST, path: `/dashboard/${crud}/`, use: 'page' });
        if (permit.includes(actions.report)) actionsResponse.push({ ico: `report`, label: this.lang.TITLES.REPORT, path: `/dashboard/${crud}/${id}`, use: 'download' });
        if (permit.includes(actions.create)) actionsResponse.push({ ico: `create`, label: this.lang.TITLES.CREATE, path: `/dashboard/${crud}/${id}`, use: 'modal' });
        if (permit.includes(actions.delete)) actionsResponse.push({ ico: `delete`, label: this.lang.TITLES.DELETE, path: `/dashboard/${crud}/${id}`, use: 'modal' });
        if (permit.includes(actions.update)) actionsResponse.push({ ico: `update`, label: this.lang.TITLES.UPDATE, path: `/dashboard/${crud}/${id}`, use: 'modal' });
        if (permit.includes(actions.download)) actionsResponse.push({ ico: `download`, label: this.lang.TITLES.DOWNLOAD, path: `/dashboard/${crud}/${id}`, use: 'modal' });

        return actionsResponse
    }

    private getPermit(crud: ModulesInterface): PermitObject {
        if (crud == `category`) {
            return {
                list: this.permit.APP_PERMIT_CONFIG_CATEGORY_LIST,
                create: this.permit.APP_PERMIT_CONFIG_CATEGORY_CREATE,
                unique: this.permit.APP_PERMIT_CONFIG_CATEGORY_SHOW,
                report: this.permit.APP_PERMIT_CONFIG_CATEGORY_REPORT,
                update: this.permit.APP_PERMIT_CONFIG_CATEGORY_UPDATE,
                delete: this.permit.APP_PERMIT_CONFIG_CATEGORY_DELETE,
            };
        }
        else if (crud == `line`) {
            return {
                list: this.permit.APP_PERMIT_CONFIG_LINE_LIST,
                create: this.permit.APP_PERMIT_CONFIG_LINE_CREATE,
                unique: this.permit.APP_PERMIT_CONFIG_LINE_SHOW,
                report: this.permit.APP_PERMIT_CONFIG_LINE_REPORT,
                update: this.permit.APP_PERMIT_CONFIG_LINE_UPDATE,
                delete: this.permit.APP_PERMIT_CONFIG_LINE_DELETE,
            };
        }
        else if (crud == `permit`) {
            return {
                list: this.permit.APP_PERMIT_PERMIT_LIST,
                create: this.permit.APP_PERMIT_PERMIT_CREATE,
                unique: this.permit.APP_PERMIT_PERMIT_SHOW,
                report: this.permit.APP_PERMIT_PERMIT_REPORT,
                update: this.permit.APP_PERMIT_PERMIT_UPDATE,
                delete: this.permit.APP_PERMIT_PERMIT_DELETE,
            };
        }
        else if (crud == `program`) {
            return {
                list: this.permit.APP_PERMIT_CONFIG_PROGRAM_LIST,
                create: this.permit.APP_PERMIT_CONFIG_PROGRAM_CREATE,
                unique: this.permit.APP_PERMIT_CONFIG_PROGRAM_SHOW,
                report: this.permit.APP_PERMIT_CONFIG_PROGRAM_REPORT,
                update: this.permit.APP_PERMIT_CONFIG_PROGRAM_UPDATE,
                delete: this.permit.APP_PERMIT_CONFIG_PROGRAM_DELETE,
            };
        }
        else if (crud == `project`) {
            return {
                list: this.permit.APP_PERMIT_PROJECT_LIST,
                create: this.permit.APP_PERMIT_PROJECT_CREATE,
                unique: this.permit.APP_PERMIT_PROJECT_SHOW,
                report: this.permit.APP_PERMIT_PROJECT_REPORT,
                update: `NO_ACTION`,
                delete: this.permit.APP_PERMIT_PROJECT_DELETE,
                download: this.permit.APP_PERMIT_PROJECT_DOWNLOAD,
            };
        }
        else if (crud == `user`) {
            return {
                list: this.permit.APP_PERMIT_USER_LIST,
                create: this.permit.APP_PERMIT_USER_CREATE,
                unique: this.permit.APP_PERMIT_USER_SHOW,
                report: this.permit.APP_PERMIT_USER_REPORT,
                update: this.permit.APP_PERMIT_USER_UPDATE,
                delete: this.permit.APP_PERMIT_USER_DELETE,
            };
        }
        else {
            return {
                list: ``,
                create: ``,
                unique: ``,
                report: ``,
                update: ``,
                delete: ``,
            };
        }
    }

}