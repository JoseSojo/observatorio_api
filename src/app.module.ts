import { Module } from '@nestjs/common';
import { jwtConstants } from './constant';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LanguajeService } from './languaje/languaje.service';
import { HistoryService } from './history/history.service';
import { ConfigModule } from './config/config.module';
import { PermitModule } from './permit/permit.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import AuthService from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import HistoryModel from './history/model/history.model';
import TestFixture from './fixtures/test.fixture';
import { UserService } from './user/user.service';
import { PermitService } from './permit/permit.service';
import AppPermit from './permit/module/app.permit';
import { ConfigCategoryService } from './config/service/category.service';
import { ConfigProgramService } from './config/service/program.service';
import { ConfigLineService } from './config/service/line.service';
import UserModel from './user/model/user.model';
import PermitModel from './permit/module/permit.model';
import { ConfigService } from './config/config.service';
import { AppController } from './app.controller';
import { GuiController } from './gui/gui.controller';
import CategoryModel from './config/model/category.model';
import ProgramModel from './config/model/program.model';
import LineModel from './config/model/line.model';
import FoundPermitService from './permit/found.permit.service';
import AppCategory from './config/app/AppCategory';
import { AuthGuard } from './guards/AuthGuard';
import { SelectController } from './select/select.controller';
import ProjectService from './project/project.service';
import ProjectModel from './project/model/project.model';
import ConfigDocumentModel from './config/model/document.model';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ReportController } from './report/report.controller';
import { StorageService } from './storage/storage.service';
import { PublicController } from './public/public.controller';
import AppEvent from './AppEvent';
import { RegionalModule } from './regional/regional.module';
import { ConfigEstadoService } from './regional/service/estados.service';
import { ConfigMunicipioService } from './regional/service/municipio.service';
import { ConfigParroquiaService } from './regional/service/parroquia.service';
import { ConfigNucleoService } from './regional/service/nucleo.service';
import { CardsService } from './cards/cards.service';
import EstadoModel from './regional/model/estados.model';
import MunicipioModel from './regional/model/municipio.model';
import ParroquiaModel from './regional/model/parroquia.model';
import NucleoModel from './regional/model/nucleo.model';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" }
    }),
    ConfigModule,
    PermitModule,
    UserModule,
    ProjectModule,
    RegionalModule,
  ],
  controllers: [
    // PermitController
    AuthController,
    AppController,
    GuiController,
    SelectController,
    ReportController,
    PublicController
  ],
  providers: [
    AppEvent,
    // globals
    JwtService,
    LanguajeService,
    AuthGuard,

    HistoryService,
    HistoryModel,

    PrismaService,
    ConfigDocumentModel,

    ValidationService,

    AuthService,
    TestFixture,
    ProjectService,
    ProjectModel,
    UserService,
    PermitService,
    AppPermit,
    ConfigCategoryService,
    ConfigProgramService,
    ConfigLineService,
    UserModel,
    PermitModel,

    ConfigService,
    CategoryModel,
    ProgramModel,
    LineModel,
    FoundPermitService,

    AppCategory,

    StorageService,

    // REGIONAL
    ConfigEstadoService,
    ConfigMunicipioService,
    ConfigParroquiaService,
    ConfigNucleoService,
    EstadoModel,
    MunicipioModel,
    ParroquiaModel,
    NucleoModel,
    CardsService,
  ],
})
export class AppModule { }
