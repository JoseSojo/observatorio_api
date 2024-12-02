import { Module } from '@nestjs/common';
import { PermitController } from './permit.controller';
import { PermitService } from './permit.service';
import PermitModel from './module/permit.model';
import AppPermit from './module/app.permit';
import { PrismaService } from 'src/prisma/prisma.service';
import FoundPermitService from './found.permit.service';
import { LanguajeService } from 'src/languaje/languaje.service';
import { ValidationService } from 'src/validation/validation.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import UserModel from 'src/user/model/user.model';
import AppEvent from 'src/AppEvent';

@Module({
    controllers: [PermitController],
    providers: [
      LanguajeService,
      ValidationService,
      PrismaService,
      PermitService,
      PermitModel,
      AppPermit,
      FoundPermitService,
      AuthGuard,
      UserModel,
      AppEvent,
    ],
  })
export class PermitModule {}
