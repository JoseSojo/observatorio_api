import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import CategoryModel from './model/category.model';
import ProgramModel from './model/program.model';
import LineModel from './model/line.model';
import { PrismaService } from 'src/prisma/prisma.service';
import FoundPermitService from 'src/permit/found.permit.service';
import { LanguajeService } from 'src/languaje/languaje.service';
import { ConfigCategoryService } from './service/category.service';
import { ConfigProgramService } from './service/program.service';
import { ConfigLineService } from './service/line.service';
import { ValidationService } from 'src/validation/validation.service';
import AppCategory from './app/AppCategory';
import LineController from './controller/line.controller';
import ProgramController from './controller/program.controller';
import CategoryController from './controller/category.controller';
import { AuthGuard } from 'src/guards/AuthGuard';
import UserModel from 'src/user/model/user.model';
import ConfigDocumentModel from './model/document.model';
import { HistoryService } from 'src/history/history.service';
import HistoryModel from 'src/history/model/history.model';
import AppEvent from 'src/AppEvent';

@Module({
  controllers: [
    ConfigController,
    LineController,
    ProgramController,
    CategoryController,
  ],
  providers: [
    AppEvent,
    HistoryService,
    HistoryModel,
    ConfigDocumentModel,
    UserModel,
    LanguajeService,
    ValidationService,
    PrismaService,
    ConfigService,
    ConfigCategoryService,
    ConfigProgramService,
    ConfigLineService,
    CategoryModel,
    ProgramModel,
    LineModel,
    FoundPermitService,
    AppCategory
  ],
})
export class ConfigModule {}
