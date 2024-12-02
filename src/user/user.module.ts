import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import UserModel from './model/user.model';
import FoundPermitService from 'src/permit/found.permit.service';
import { LanguajeService } from 'src/languaje/languaje.service';
import { PermitService } from 'src/permit/permit.service';
import { ValidationService } from 'src/validation/validation.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import AppPermit from 'src/permit/module/app.permit';
import PermitModel from 'src/permit/module/permit.model';
import AppEvent from 'src/AppEvent';
import HistoryModel from 'src/history/model/history.model';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [UserController],
  providers: [
    AppEvent,
    LanguajeService,
    ValidationService,
    PrismaService,
    FoundPermitService,
    UserService,
    UserModel,
    AuthGuard,
    AppPermit,
    PermitService,
    PermitModel,
    HistoryModel,
    HistoryService
  ]
})
export class UserModule {}
