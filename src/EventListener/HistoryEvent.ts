import { Injectable } from '@nestjs/common';
import { HistoryModel } from 'src/Model/S/HistoryModel';
import { StaticticsMonthModel } from 'src/Model/S/StaticticsMonthModel';
import { History } from 'src/Validation/Listener/HistoryEvent';

@Injectable()
export class HistoryEventListener {

  constructor(
    private history: HistoryModel
  ) {}

  register(event: History) {
    this.history.Create({ name:event.name,id:event.id,event:event.event });
  }
}