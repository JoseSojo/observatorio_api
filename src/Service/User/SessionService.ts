import { Injectable } from '@nestjs/common';
import { SessionModel } from 'src/Model/M/User/SessionModel';
import { LoginDto } from 'src/Validation/Auth/LoginDto';
import { ReponseServiceDto } from 'src/Validation/GlobalType';
import { GlobalService } from '../GlobalService';
import { Prisma } from '@prisma/client';
import { currentSuperAdmin } from 'src/Factory/PermitsFactory';
import { PermitsModel } from 'src/Model/M/Permits/PermitsModel';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoryEventListener } from 'src/EventListener/HistoryEvent';
import { StaticticsForMonthEventListener } from 'src/EventListener/StaticticsForMonthEvent';
import { StaticticsForYearEventListener } from 'src/EventListener/StaticticsForYearEvent';

@Injectable()
export class SessionService {

    constructor(
        private Session: SessionModel,
        private rol: PermitsModel,
        private event: EventEmitter2,
        private history: HistoryEventListener,
        private staticticsMonth: StaticticsForMonthEventListener,
        private staticticsYear: StaticticsForYearEventListener,
    ) {}

}