import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StaticticsMonthModel } from 'src/Model/S/StaticticsMonthModel';
import { GlobalService } from 'src/Service/GlobalService';
import { ForMonthEvent } from 'src/Validation/Listener/StaticticsEvent';

@Injectable()
export class StaticticsForMonthEventListener {

  constructor(
    private statictics: StaticticsMonthModel,
    private global: GlobalService
  ) {}

  public async register(event: ForMonthEvent) {
    await this.statictics.Execute({ name:event.event,year:this.global.GetYear(),id:event.id });
  }
  
}