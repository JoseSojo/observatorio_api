import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import FoundPermitService from 'src/permit/found.permit.service';
import { LanguajeService } from 'src/languaje/languaje.service';
import { ValidationService } from 'src/validation/validation.service';
import AppCategory from './app/AppCategory';
import UserModel from 'src/user/model/user.model';
import { HistoryService } from 'src/history/history.service';
import HistoryModel from 'src/history/model/history.model';
import AppEvent from 'src/AppEvent';
import MunicipioController from './controller/municipio.controller';
import StateController from './controller/estado.controller';
import NucleoController from './controller/nucleo.controller';
import ParroquiaController from './controller/parroquia.controller';
import { ConfigEstadoService } from './service/estados.service';
import { ConfigMunicipioService } from './service/municipio.service';
import { ConfigParroquiaService } from './service/parroquia.service';
import { ConfigNucleoService } from './service/nucleo.service';
import EstadoModel from './model/estados.model';
import MunicipioModel from './model/municipio.model';
import ParroquiaModel from './model/parroquia.model';
import NucleoModel from './model/nucleo.model';

@Module({
  controllers: [
    MunicipioController,
    StateController,
    NucleoController,
    ParroquiaController
  ],
  providers: [
    AppEvent,
    HistoryService,
    HistoryModel,
    UserModel,
    LanguajeService,
    ValidationService,
    PrismaService,
    FoundPermitService,
    AppCategory,

    ConfigEstadoService,
    ConfigMunicipioService,
    ConfigParroquiaService,
    ConfigNucleoService,
    EstadoModel,
    MunicipioModel,
    ParroquiaModel,
    NucleoModel,
    

  ],
})
export class RegionalModule {}
