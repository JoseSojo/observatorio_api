import { Module } from '@nestjs/common';
import ProjectService from './project.service';
import { ProjectController } from './project.controller';
import HistoryProjectService from './history/history.service';
import ProjectModel from './model/project.model';
import HistotyProjectModel from './history/model/history.model';
import FoundPermitService from 'src/permit/found.permit.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LanguajeService } from 'src/languaje/languaje.service';
import { ValidationService } from 'src/validation/validation.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import UserModel from 'src/user/model/user.model';
import ConfigDocumentModel from 'src/config/model/document.model';
import AppEvent from 'src/AppEvent';
import HistoryModel from 'src/history/model/history.model';
import { HistoryService } from 'src/history/history.service';
import AppPermit from 'src/permit/module/app.permit';
import { StaticticsService } from 'src/statictics/statictics.service';
import ProgramModel from 'src/config/model/program.model';

@Module({
  providers: [
    AppEvent,
    AppPermit,
    LanguajeService,
    ValidationService,
    PrismaService,
    ProjectService,
    HistoryProjectService,
    ProjectModel,
    HistotyProjectModel,
    FoundPermitService,
    AuthGuard,
    UserModel,
    ConfigDocumentModel,
    HistoryModel,
    HistoryService,
    StaticticsService,
    ProgramModel,
  ],
  controllers: [ProjectController]
})
export class ProjectModule {}
