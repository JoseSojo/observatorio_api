import { Body, Controller, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import * as fs from 'fs/promises';
import ConfigDocumentModel from 'src/config/model/document.model';
import { AuthGuard } from 'src/guards/AuthGuard';
import { ProjectCreate } from './guards/project.model';
import ProjectService from './project.service';
import ProjectModel from './model/project.model';
import { HistoryService } from 'src/history/history.service';
import AppEvent from 'src/AppEvent';
import { HistoryCreate, ProjectHistoryCreate } from 'src/history/guards/history.guard';
import HistotyProjectModel from './history/model/history.model';
import HistoryProjectService from './history/history.service';
import AppPermit from 'src/permit/module/app.permit';
import { LanguajeService } from 'src/languaje/languaje.service';
import { LanguajeInterface } from 'src/languaje/guard/languaje.interface';

@Controller('project')
export class ProjectController {

    private lang: LanguajeInterface;

    constructor(
        private languaje: LanguajeService,
        private docsModel: ConfigDocumentModel,
        private projectService: ProjectService,
        private model: ProjectModel,
        private historyProject: HistotyProjectModel,
        private historyProjectService: HistoryProjectService,
        private permit: AppPermit,
        // private history: HistoryService,
        private appEvent: AppEvent,
    ) {
        this.lang = this.languaje.GetTranslate();
    }

    @UseInterceptors(FileInterceptor('file'))
    // @UseInterceptors(FileInterceptor('portada'))
    @Post('create')
    @UseGuards(AuthGuard)
    private async create(@UploadedFile() file: Express.Multer.File, @Req() req: any, @Body() body: ProjectCreate) {
        // variables
        const ext = file.mimetype.split(`/`).pop();
        const user = req.user as any;
        const filePath = `${process.cwd()}/public/projects/${this.fileName()}.${ext}`; // Replace with your desired path
        const downloadPath = `/public/projects/${this.fileName()}.${ext}`; // Replace with your desired path

        // permisos

        // validación
        if (!body.date) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.date, error: true }
        // if (!body.documentId) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.file, error: true }
        if (!body.keywords) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.keywords, error: true }
        if (!body.programId) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.program, error: true }
        if (!body.resumen) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.sumary, error: true }
        if (!body.title) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.title, error: true }
        // if (!body.userIdCurrent) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.FIELDS_REQUIERED.author, error: true }

        // title found
        const titleFoundPromise = this.projectService.find({ filter:{ title:body.title } });
        const descriptionFoundPromise = this.projectService.find({ filter:{ resumen:body.resumen } });

        const titleFound = await titleFoundPromise;
        const descriptionFound = await descriptionFoundPromise;
        if(titleFound.body) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.TITLE_IN_USE, error: true }
        if(body.resumen.length > 150) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.SUMARY_LONG_TEXT, error: true }
        if(descriptionFound.body) return { message: this.lang.ACTIONS.DANGER.VALIDATIONS.SUMARY_IN_USE, error: true }

        // inicio logica

        // Write the file using the buffer
        const whiteFilePromise = fs.writeFile(filePath, file.buffer);
        const createDoc: Prisma.configDocumentCreateInput = {
            createByRef: { connect:{ id:user.id } },
            mimyType: file.mimetype,
            originalName: file.originalname,
            path: filePath,
            donwload: downloadPath,
            size: file.size,
        }
        const createDocumentPromise = this.docsModel.create({ data:createDoc });

        const createDocument = await createDocumentPromise;

        const currentCreateProject: ProjectCreate = {
            date: body.date,
            documentId: createDocument.id,
            downloader: body.downloader,
            keywords: body.keywords,
            lineId: body.lineId,
            programId: body.programId,
            public: body.public,
            resumen: body.resumen,
            title: body.title,
            userId: body.userId,
            userIdCurrent: JSON.parse(body.userId)
        } 

        const createProjectPromise = this.projectService.create({ data:currentCreateProject });
        
        // EXECUTE PROMISES
        await whiteFilePromise;
        const responseService = await createProjectPromise as any;

        // await this.RegisterHistory({
        //     eventName: this.appEvent.EVENT_PROJECT_CREATE,
        //     userId: req.user.id,
        //     projectId: responseService.body.id,
        //     userAuth: true
        // });

        return responseService;
    }

    @Get(``)
    @UseGuards(AuthGuard)
    private async paginate(@Req() req: any, @Query() query: { skip:string, take:string, param?:string }) {
        // variables
        const user = req.user as any;
        const permits = user.rolReference.group as string[];

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.projectsWhereInput[] = [];

        if (user.rolReference.name === this.permit.ESTUDIANTE) {
            // filter.push({ authos:{ every:{ createById:user.id } } });
            filter.push({ authos:{ some:{ createById:user.id } } });
        }

        filter.push({ deleteAt:null })

        const customFilter: Prisma.projectsWhereInput = { AND:filter }

        const responseService = await this.projectService.paginate({ filter:{
            ...customFilter,
            OR: [
                { title: {contains:query.param} },
                { resumen: {contains:query.param} },
                { keywords: {contains:query.param} },
                { authos: {
                    some: {
                        createByRef: {
                            OR: [
                                { name: {contains:query.param} },
                                { lastname: {contains:query.param} },
                                { email: {contains:query.param} },
                            ]
                        }
                    }
                } },
            ]
        }, skip, take });

        return responseService;
    }

    @Get(`:id/unique`)
    @UseGuards(AuthGuard)
    private async find(@Req() req: any, @Param() param: { id:string }) {

        // variables

        // permisos
        
        // validaciones

        // lógica

        const projectFoundPromise = this.projectService.find({ filter:{ id:param.id } });
        const projectFound = await projectFoundPromise;

        return projectFound;
    }

    @Put(`:id/update`)
    @UseGuards(AuthGuard)
    private async update(@Req() req: any, @Body() body: ProjectCreate, @Param() param: {id:string}) {

        // variables

        // permisos
        
        // validaciones

        // lógica

        const customUpdate: Prisma.projectsUpdateInput = {
            date: body.date,
            downloader: body.downloader ? true : false,
            public: body.public ? true : false,
            keywords: body.keywords,
            lineRef: { connect:{ id:body.lineId } },
            programRef: { connect:{ id:body.programId } },
            resumen: body.resumen,
            title: body.title
        }

        const projectFoundPromise = this.projectService.udpate({ id:param.id, data:customUpdate });
        const projectFound = await projectFoundPromise;

        await this.RegisterHistory({
            eventName: this.appEvent.EVENT_PROJECT_UPDATE,
            userId: req.user.id,
            projectId: param.id,
            userAuth: true
        });

        return projectFound;
    }

    @Put(`:id/public`)
    @UseGuards(AuthGuard)
    private async customPublic(@Req() req: any, @Body() body: ProjectCreate, @Param() param: {id:string}) {

        // variables

        // permisos
        
        // validaciones

        // lógica

        const projectFound = await this.projectService.find({ filter:{id:param.id} });
        const project = projectFound.body;
        const projectFoundPromise = this.projectService.udpate({ id:param.id, data:{ public:!project.public } });
        
        const responseService = await projectFoundPromise;

        await this.RegisterHistory({
            eventName: this.appEvent.EVENT_PROJECT_SET_PUBLIC,
            userId: req.user.id,
            projectId: param.id,
            userAuth: true
        });

        return responseService;
    }

    @Put(`:id/download`)
    @UseGuards(AuthGuard)
    private async download(@Req() req: any, @Body() body: ProjectCreate, @Param() param: {id:string}) {

        // variables

        // permisos
        
        // validaciones

        // lógica

        const projectFound = await this.projectService.find({ filter:{id:param.id} });
        const project = projectFound.body;
        const projectFoundPromise = this.projectService.udpate({ id:param.id, data:{ downloader:!project.downloader } });
        
        const responseService = await projectFoundPromise;

        await this.RegisterHistory({
            eventName: this.appEvent.EVENT_PROJECT_SET_DOWNLOAD,
            userId: req.user.id,
            projectId: param.id,
            userAuth: true
        });

        return responseService;
    }

    @Put(`:id/delete`)
    @UseGuards(AuthGuard)
    private async delete(@Req() req: any, @Body() body: ProjectCreate, @Param() param: {id:string}) {

        // variables

        // permisos
        
        // validaciones

        // lógica

        const projectFound = await this.projectService.find({ filter:{id:param.id} });
        const project = projectFound.body;

        if(!project) {
            return {
                message: `Error al eliminar`,
                error: true,
                body: null
            }
        }

        const projectFoundPromise = this.projectService.delte({ id:param.id });
        const responseService = await projectFoundPromise;

        await this.RegisterHistory({
            eventName: this.appEvent.EVENT_PROJECT_DELETE,
            userId: req.user.id,
            projectId: param.id,
            userAuth: true
        });
        return responseService;
    }

    @Get(`/report/many`)
    @UseGuards(AuthGuard)
    private async reportMany(@Req() req: any) {
        // variables
        let filter: Prisma.projectsWhereInput = {deleteAt:null}

        const count = await this.model.count({filter});
        let now = 0;
        let skip = 0;
        let take = 15;

        const page: any[] = []; 

        // permisos

        // lógica

        let select: Prisma.projectsSelect = {};
        let header: string[] = [];
        let label: string[]  = [];

        select = { 
            _count:{select:{authos:true}},
            date:true,
            title:true,
            programRef:{select:{name:true,categoryRef:{select:{name:true}}}},
            downloader: true,
            public: true,
            lineRef: { select:{name:true} }
        };
        header = [`Título`,`Programa`,`Categoría`,`Línea de investigación`,`Autores`,`Fecha`,`Público`,`Descargable`];
        label = [`title`,`programRef.name`,`programRef.categoryRef.name`,`lineRef.name`,`_count.authos`,`date`,`public`,`downloader`];

        do {
            const find = await this.model.findAll({ skip, take, filter, select });

            page.push({
                list: find
            });

            skip = skip + take;
            now = now + take
        } while (now < count);

        return {
            page: page,
            count: count,
            header,
            label,
        };
    }

    @Get(`/report/unique/:id`)
    @UseGuards(AuthGuard)
    private async reportUnique(@Req() req: any, @Param() param: {id:string}) {
        // variables

        const page: any[] = []; 
        const historyPromise = this.getCustomHistory(param.id);

        const dataPromise = this.model.find({ filter:{ id:param.id } });

        const header = this.projectService.getDataUnique();
        const label = this.projectService.getUniqueExtract();

        const data = await dataPromise;
        const history = await historyPromise;
        
        return {
            data,
            history: history,
            header,
            label,  
        };
    }

    @Get(`:id/history`)
    @UseGuards(AuthGuard)
    private async paginatehistory(@Req() req: any, @Param() param:{id:string},  @Query() query: { skip:string, take:string, param?:string }) {
        // variables

        // permisos

        // lógica
        const skip = query.skip ? Number(query.skip) : 0;
        const take = query.take ? Number(query.take) : 10;

        const filter: Prisma.historyProjectWhereInput = {
            projectId: param.id
        }

        const responseServicePromise = this.historyProjectService.paginate({ filter, skip, take });
        const responseService = await responseServicePromise;

        return responseService;
    }

    private async getCustomHistory(id:string) {
        return { count:0, list:[] }
        let filter: Prisma.projectsWhereInput = {deleteAt:null}
        const count = await this.model.count({filter});
        let now = 0;
        let skip = 0;
        let take = 20;

        const currentList = [];

        // permisos

        // lógica

        let select: Prisma.projectsSelect = {};
        let data: string[][] = [];
        let label: string[]  = [];

        select = {  };
        data.push([`Descripción`,`Usuario`,``,`Fecha`]);
        data.push([`description`,`createByRef.name`,`createByRef.lastname`,`createAt`]);

        do {
            const find = await this.model.findAll({ skip, take, filter, select });
            currentList.push(find);
            skip = skip + take;
            now = now + take
        } while (now < count);

        return {
            count,
            list: currentList
        }
    }

    private fileName(): string {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
    }

    private async RegisterHistory (data: ProjectHistoryCreate) {
        await this.historyProject.create({ data:{
            eventName: data.eventName,
            projectRef: {
                connect: {
                    id: data.projectId
                }
            },
            userAuth: true,
            userRef: {
                connect: {
                    id: data.userId
                }
            }
        } })
    }

}
